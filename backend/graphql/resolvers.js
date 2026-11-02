import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import pool from '../config/database.js';

// ==============================================================
// FUNCIONES AUXILIARES
// Los nombres de tablas y columnas son siempre constantes internas
// (nunca vienen del usuario), y los valores siempre van con "?".
// ==============================================================

// Un registro por su identificador.
async function buscarUno(tabla, columna, id) {
    const [rows] = await pool.query(
        `SELECT * FROM \`${tabla}\` WHERE \`${columna}\` = ?`,
        [id]
    );

    return rows[0] || null;
}

// Varios registros que comparten un valor (ej. los torneos de un videojuego).
async function buscarVarios(tabla, columna, valor) {
    const [rows] = await pool.query(
        `SELECT * FROM \`${tabla}\` WHERE \`${columna}\` = ?`,
        [valor]
    );

    return rows;
}

// Todos los registros de una tabla.
async function buscarTodos(tabla) {
    const [rows] = await pool.query(`SELECT * FROM \`${tabla}\``);

    return rows;
}

// Fecha actual en formato de MySQL: YYYY-MM-DD HH:MM:SS
function ahora() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

const CAMPOS_FECHA = ['fechaInicio', 'fechaFin', 'fecha', 'fechaRegistro'];

// Quita los campos vacíos y deja las fechas en formato MySQL
// (acepta "2026-11-10 10:00:00" y también "2026-11-10T10:00:00Z").
function limpiarDatos(datos) {
    const limpio = {};

    for (const [campo, valor] of Object.entries(datos)) {
        if (valor === undefined || valor === null) continue;

        limpio[campo] =
            CAMPOS_FECHA.includes(campo) && typeof valor === 'string'
                ? valor.replace('T', ' ').slice(0, 19)
                : valor;
    }

    return limpio;
}

// Convierte los errores de MySQL en mensajes entendibles para Postman.
function traducirError(error) {
    if (error instanceof GraphQLError) return error;

    switch (error.code) {
        case 'ER_NO_REFERENCED_ROW_2':
            return new GraphQLError(
                'Uno de los ids enviados no existe (revisa idTorneo, idJugador, idEquipo, etc.).'
            );
        case 'ER_DUP_ENTRY':
            return new GraphQLError(
                'Ya existe un registro con ese valor único (email, username, gamertag o jugador ya inscrito en el torneo).'
            );
        case 'ER_TRUNCATED_WRONG_VALUE':
        case 'ER_WRONG_VALUE':
            return new GraphQLError(
                'Valor inválido. Las fechas deben tener el formato YYYY-MM-DD HH:MM:SS.'
            );
        default:
            return new GraphQLError(error.message);
    }
}

// INSERT genérico: devuelve el registro recién creado.
async function crear(tabla, columnaId, datos) {
    const campos = limpiarDatos(datos);
    const columnas = Object.keys(campos);

    try {
        const [resultado] = await pool.query(
            `INSERT INTO \`${tabla}\` (${columnas.map((c) => `\`${c}\``).join(', ')})
             VALUES (${columnas.map(() => '?').join(', ')})`,
            Object.values(campos)
        );

        return await buscarUno(tabla, columnaId, resultado.insertId);
    } catch (error) {
        throw traducirError(error);
    }
}

// UPDATE genérico: solo cambia los campos enviados.
async function actualizar(tabla, columnaId, id, datos) {
    const campos = limpiarDatos(datos);
    const columnas = Object.keys(campos);

    if (columnas.length === 0) {
        throw new GraphQLError('No enviaste ningún campo para actualizar.');
    }

    try {
        await pool.query(
            `UPDATE \`${tabla}\`
             SET ${columnas.map((c) => `\`${c}\` = ?`).join(', ')}
             WHERE \`${columnaId}\` = ?`,
            [...Object.values(campos), id]
        );

        return await buscarUno(tabla, columnaId, id);
    } catch (error) {
        throw traducirError(error);
    }
}

// DELETE genérico: true si se borró algo.
async function eliminar(tabla, columnaId, id) {
    try {
        const [resultado] = await pool.query(
            `DELETE FROM \`${tabla}\` WHERE \`${columnaId}\` = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    } catch (error) {
        throw traducirError(error);
    }
}

// ==============================================================
// RESOLVERS
// ==============================================================

const resolvers = {

    Query: {

        // USUARIOS
        obtenerUsuarios: () => buscarTodos('usuarios'),
        obtenerUsuario: (_, { id }) => buscarUno('usuarios', 'idUsuario', id),
        obtenerUsuarioPorEmail: (_, { email }) =>
            buscarUno('usuarios', 'email', email),

        // VIDEOJUEGOS
        obtenerVideojuegos: () => buscarTodos('videojuego'),
        obtenerVideojuego: (_, { id }) =>
            buscarUno('videojuego', 'idVideojuego', id),

        // TORNEOS
        obtenerTorneos: () => buscarTodos('torneos'),
        obtenerTorneo: (_, { id }) => buscarUno('torneos', 'idTorneo', id),
        obtenerTorneosPorVideojuego: (_, { idVideojuego }) =>
            buscarVarios('torneos', 'idVideojuego', idVideojuego),
        obtenerTorneosPorOrganizador: (_, { idUsuario }) =>
            buscarVarios('torneos', 'idUsuario', idUsuario),

        // JUGADORES
        obtenerJugadores: () => buscarTodos('perfil_jugador'),
        obtenerJugador: (_, { id }) =>
            buscarUno('perfil_jugador', 'idJugador', id),
        obtenerJugadorPorUsuario: (_, { idUsuario }) =>
            buscarUno('perfil_jugador', 'idUsuario', idUsuario),

        // EQUIPOS
        obtenerEquipos: () => buscarTodos('equipo'),
        obtenerEquipo: (_, { id }) => buscarUno('equipo', 'idEquipo', id),
        obtenerEquiposPorJugador: (_, { idJugador }) =>
            buscarVarios('equipo', 'idJugador', idJugador),

        // REGISTROS
        obtenerRegistros: () => buscarTodos('registro_torneo'),
        obtenerRegistro: (_, { id }) =>
            buscarUno('registro_torneo', 'idRegistro', id),
        obtenerRegistrosPorTorneo: (_, { idTorneo }) =>
            buscarVarios('registro_torneo', 'idTorneo', idTorneo),
        obtenerRegistrosPorJugador: (_, { idJugador }) =>
            buscarVarios('registro_torneo', 'idJugador', idJugador),

        // ENFRENTAMIENTOS
        obtenerEnfrentamientos: () => buscarTodos('enfrentamientos'),
        obtenerEnfrentamiento: (_, { id }) =>
            buscarUno('enfrentamientos', 'idEnfrentamientos', id),
        obtenerEnfrentamientosPorPartida: (_, { idPartida }) =>
            buscarVarios('enfrentamientos', 'idPartida', idPartida),

        // RESULTADOS
        obtenerResultados: () => buscarTodos('resultado_enfrentamientos'),
        obtenerResultado: (_, { id }) =>
            buscarUno('resultado_enfrentamientos', 'idResultados', id),
        obtenerResultadosPorJugador: (_, { idJugador }) =>
            buscarVarios('resultado_enfrentamientos', 'idJugador', idJugador),

        // PARTIDAS
        obtenerPartidas: () => buscarTodos('partidas'),
        obtenerPartida: (_, { id }) =>
            buscarUno('partidas', 'idPartidas', id),
        obtenerPartidasPorTorneo: (_, { idTorneo }) =>
            buscarVarios('partidas', 'idTorneo', idTorneo)

    },

    Mutation: {

        // ---------- USUARIOS ----------
        crearUsuario: async (_, args) =>
            crear('usuarios', 'idUsuario', {
                ...args,
                password: await bcrypt.hash(args.password, 10)
            }),

        actualizarUsuario: async (_, { id, ...campos }) => {
            if (campos.password) {
                campos.password = await bcrypt.hash(campos.password, 10);
            }

            return actualizar('usuarios', 'idUsuario', id, campos);
        },

        eliminarUsuario: (_, { id }) => eliminar('usuarios', 'idUsuario', id),

        iniciarSesion: async (_, { email, password }) => {
            const usuario = await buscarUno('usuarios', 'email', email);
            const valido =
                usuario && (await bcrypt.compare(password, usuario.password));

            if (!valido) {
                throw new GraphQLError('Correo o contraseña incorrectos.');
            }

            return usuario;
        },

        // ---------- VIDEOJUEGOS ----------
        crearVideojuego: (_, args) =>
            crear('videojuego', 'idVideojuego', args),
        actualizarVideojuego: (_, { id, ...campos }) =>
            actualizar('videojuego', 'idVideojuego', id, campos),
        eliminarVideojuego: (_, { id }) =>
            eliminar('videojuego', 'idVideojuego', id),

        // ---------- TORNEOS ----------
        crearTorneo: (_, args) => {
            if (args.maxParticipantes < 1) {
                throw new GraphQLError('maxParticipantes debe ser mayor a 0.');
            }

            const { fechaInicio, fechaFin } = limpiarDatos(args);

            if (fechaFin < fechaInicio) {
                throw new GraphQLError(
                    'La fecha de fin no puede ser anterior a la fecha de inicio.'
                );
            }

            return crear('torneos', 'idTorneo', args);
        },
        actualizarTorneo: (_, { id, ...campos }) =>
            actualizar('torneos', 'idTorneo', id, campos),
        eliminarTorneo: (_, { id }) => eliminar('torneos', 'idTorneo', id),

        // ---------- JUGADORES ----------
        crearJugador: (_, args) =>
            crear('perfil_jugador', 'idJugador', args),
        actualizarJugador: (_, { id, ...campos }) =>
            actualizar('perfil_jugador', 'idJugador', id, campos),
        eliminarJugador: (_, { id }) =>
            eliminar('perfil_jugador', 'idJugador', id),

        // ---------- EQUIPOS ----------
        crearEquipo: (_, args) => crear('equipo', 'idEquipo', args),
        actualizarEquipo: (_, { id, ...campos }) =>
            actualizar('equipo', 'idEquipo', id, campos),
        eliminarEquipo: (_, { id }) => eliminar('equipo', 'idEquipo', id),

        // ---------- REGISTROS A TORNEOS ----------
        crearRegistro: async (_, args) => {
            const torneo = await buscarUno('torneos', 'idTorneo', args.idTorneo);

            if (!torneo) {
                throw new GraphQLError('El torneo no existe.');
            }

            const [[{ total }]] = await pool.query(
                'SELECT COUNT(*) AS total FROM registro_torneo WHERE idTorneo = ?',
                [args.idTorneo]
            );

            if (total >= torneo.maxParticipantes) {
                throw new GraphQLError(
                    'El torneo ya alcanzó el máximo de participantes.'
                );
            }

            return crear('registro_torneo', 'idRegistro', {
                ...args,
                fechaRegistro: args.fechaRegistro || ahora()
            });
        },
        actualizarRegistro: (_, { id, ...campos }) =>
            actualizar('registro_torneo', 'idRegistro', id, campos),
        eliminarRegistro: (_, { id }) =>
            eliminar('registro_torneo', 'idRegistro', id),

        // ---------- RESULTADOS ----------
        crearResultado: (_, args) =>
            crear('resultado_enfrentamientos', 'idResultados', args),
        actualizarResultado: (_, { id, ...campos }) =>
            actualizar('resultado_enfrentamientos', 'idResultados', id, campos),
        eliminarResultado: (_, { id }) =>
            eliminar('resultado_enfrentamientos', 'idResultados', id),

        // ---------- PARTIDAS ----------
        crearPartida: (_, args) => crear('partidas', 'idPartidas', args),
        actualizarPartida: (_, { id, ...campos }) =>
            actualizar('partidas', 'idPartidas', id, campos),
        eliminarPartida: (_, { id }) =>
            eliminar('partidas', 'idPartidas', id),

        // ---------- ENFRENTAMIENTOS ----------
        crearEnfrentamiento: (_, args) =>
            crear('enfrentamientos', 'idEnfrentamientos', args),
        actualizarEnfrentamiento: (_, { id, ...campos }) =>
            actualizar('enfrentamientos', 'idEnfrentamientos', id, campos),
        eliminarEnfrentamiento: (_, { id }) =>
            eliminar('enfrentamientos', 'idEnfrentamientos', id)

    },

    // ==========================================================
    // RELACIONES ENTRE TABLAS
    // GraphQL obtiene estos datos solamente cuando se solicitan.
    // ==========================================================

    Usuario: {
        perfil: (padre) =>
            buscarUno('perfil_jugador', 'idUsuario', padre.idUsuario),
        torneosOrganizados: (padre) =>
            buscarVarios('torneos', 'idUsuario', padre.idUsuario)
    },

    Videojuego: {
        torneos: (padre) =>
            buscarVarios('torneos', 'idVideojuego', padre.idVideojuego)
    },

    Torneo: {
        videojuego: (padre) =>
            buscarUno('videojuego', 'idVideojuego', padre.idVideojuego),
        organizador: (padre) =>
            buscarUno('usuarios', 'idUsuario', padre.idUsuario),
        registros: (padre) =>
            buscarVarios('registro_torneo', 'idTorneo', padre.idTorneo),
        partidas: (padre) =>
            buscarVarios('partidas', 'idTorneo', padre.idTorneo),
        totalRegistrados: async (padre) => {
            const [[{ total }]] = await pool.query(
                'SELECT COUNT(*) AS total FROM registro_torneo WHERE idTorneo = ?',
                [padre.idTorneo]
            );

            return total;
        }
    },

    PerfilJugador: {
        usuario: (padre) =>
            buscarUno('usuarios', 'idUsuario', padre.idUsuario),
        equipos: (padre) =>
            buscarVarios('equipo', 'idJugador', padre.idJugador),
        registros: (padre) =>
            buscarVarios('registro_torneo', 'idJugador', padre.idJugador)
    },

    Equipo: {
        jugador: (padre) =>
            buscarUno('perfil_jugador', 'idJugador', padre.idJugador)
    },

    RegistroTorneo: {
        torneo: (padre) => buscarUno('torneos', 'idTorneo', padre.idTorneo),
        jugador: (padre) =>
            buscarUno('perfil_jugador', 'idJugador', padre.idJugador),
        equipo: (padre) => buscarUno('equipo', 'idEquipo', padre.idEquipo)
    },

    Enfrentamiento: {
        jugador: (padre) =>
            buscarUno('perfil_jugador', 'idJugador', padre.idJugador),
        partida: (padre) =>
            buscarUno('partidas', 'idPartidas', padre.idPartida)
    },

    Resultado: {
        jugador: (padre) =>
            buscarUno('perfil_jugador', 'idJugador', padre.idJugador)
    },

    Partida: {
        torneo: (padre) => buscarUno('torneos', 'idTorneo', padre.idTorneo),
        registro: (padre) =>
            buscarUno('registro_torneo', 'idRegistro', padre.idRegistro),
        enfrentamientos: (padre) =>
            buscarVarios('enfrentamientos', 'idPartida', padre.idPartidas),
        resultado: (padre) =>
            buscarUno(
                'resultado_enfrentamientos',
                'idResultados',
                padre.idResultados
            )
    }

};

export default resolvers;
