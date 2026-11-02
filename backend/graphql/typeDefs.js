import gql from 'graphql-tag';

const typeDefs = gql`

    # ==========================================================
    # TIPOS
    # ==========================================================

    type Usuario {
        idUsuario: ID!
        username: String!
        email: String!
        rol: String!
        perfil: PerfilJugador
        torneosOrganizados: [Torneo!]!
    }

    type Videojuego {
        idVideojuego: ID!
        nombre: String!
        descripcion: String!
        disponible: Boolean!
        torneos: [Torneo!]!
    }

    type Torneo {
        idTorneo: ID!
        nombreTorneo: String!
        descripcion: String!
        tipoTorneo: String!
        maxParticipantes: Int!
        fechaInicio: String!
        fechaFin: String!
        status: Boolean!
        videojuego: Videojuego!
        organizador: Usuario!
        registros: [RegistroTorneo!]!
        partidas: [Partida!]!
        totalRegistrados: Int!
    }

    type PerfilJugador {
        idJugador: ID!
        idUsuario: ID!
        gamertag: String!
        usuario: Usuario!
        equipos: [Equipo!]!
        registros: [RegistroTorneo!]!
    }

    type Equipo {
        idEquipo: ID!
        idJugador: ID!
        nombreEquipo: String!
        jugador: PerfilJugador!
    }

    type RegistroTorneo {
        idRegistro: ID!
        idTorneo: ID!
        idJugador: ID!
        idEquipo: ID!
        clasificacion: String!
        estado: Boolean!
        fechaRegistro: String!
        torneo: Torneo!
        jugador: PerfilJugador!
        equipo: Equipo!
    }

    type Enfrentamiento {
        idEnfrentamientos: ID!
        idPartida: ID!
        idJugador: ID!
        posicionActual: Int!
        jugador: PerfilJugador!
        partida: Partida!
    }

    type Resultado {
        idResultados: ID!
        idJugador: ID!
        puntuacion: Int!
        ganador: String!
        posicion: Int!
        jugador: PerfilJugador!
    }

    type Partida {
        idPartidas: ID!
        idTorneo: ID!
        idRegistro: ID!
        idResultados: ID!
        numeroRonda: Int!
        numeroPartida: Int!
        posicionActual: Int!
        fecha: String!
        status: Boolean!
        torneo: Torneo!
        registro: RegistroTorneo!
        enfrentamientos: [Enfrentamiento!]!
        resultado: Resultado!
    }

    # ==========================================================
    # QUERIES
    # ==========================================================

    type Query {

        # Usuarios
        obtenerUsuarios: [Usuario!]!
        obtenerUsuario(id: ID!): Usuario
        obtenerUsuarioPorEmail(email: String!): Usuario

        # Videojuegos
        obtenerVideojuegos: [Videojuego!]!
        obtenerVideojuego(id: ID!): Videojuego

        # Torneos
        obtenerTorneos: [Torneo!]!
        obtenerTorneo(id: ID!): Torneo
        obtenerTorneosPorVideojuego(idVideojuego: ID!): [Torneo!]!
        obtenerTorneosPorOrganizador(idUsuario: ID!): [Torneo!]!

        # Jugadores
        obtenerJugadores: [PerfilJugador!]!
        obtenerJugador(id: ID!): PerfilJugador
        obtenerJugadorPorUsuario(idUsuario: ID!): PerfilJugador

        # Equipos
        obtenerEquipos: [Equipo!]!
        obtenerEquipo(id: ID!): Equipo
        obtenerEquiposPorJugador(idJugador: ID!): [Equipo!]!

        # Registros a torneos
        obtenerRegistros: [RegistroTorneo!]!
        obtenerRegistro(id: ID!): RegistroTorneo
        obtenerRegistrosPorTorneo(idTorneo: ID!): [RegistroTorneo!]!
        obtenerRegistrosPorJugador(idJugador: ID!): [RegistroTorneo!]!

        # Enfrentamientos
        obtenerEnfrentamientos: [Enfrentamiento!]!
        obtenerEnfrentamiento(id: ID!): Enfrentamiento
        obtenerEnfrentamientosPorPartida(idPartida: ID!): [Enfrentamiento!]!

        # Resultados
        obtenerResultados: [Resultado!]!
        obtenerResultado(id: ID!): Resultado
        obtenerResultadosPorJugador(idJugador: ID!): [Resultado!]!

        # Partidas
        obtenerPartidas: [Partida!]!
        obtenerPartida(id: ID!): Partida
        obtenerPartidasPorTorneo(idTorneo: ID!): [Partida!]!

    }

    # ==========================================================
    # MUTATIONS
    # En las "actualizar" solo envía los campos que quieras cambiar.
    # Las "eliminar" regresan true si se borró algo, false si el id no existía.
    # ==========================================================

    type Mutation {

        # Usuarios
        crearUsuario(username: String!, email: String!, password: String!, rol: String!): Usuario!
        actualizarUsuario(id: ID!, username: String, email: String, password: String, rol: String): Usuario
        eliminarUsuario(id: ID!): Boolean!
        iniciarSesion(email: String!, password: String!): Usuario!

        # Videojuegos
        crearVideojuego(nombre: String!, descripcion: String!, disponible: Boolean = true): Videojuego!
        actualizarVideojuego(id: ID!, nombre: String, descripcion: String, disponible: Boolean): Videojuego
        eliminarVideojuego(id: ID!): Boolean!

        # Torneos
        crearTorneo(
            idVideojuego: ID!
            idUsuario: ID!
            nombreTorneo: String!
            descripcion: String!
            tipoTorneo: String!
            maxParticipantes: Int!
            fechaInicio: String!
            fechaFin: String!
            status: Boolean = true
        ): Torneo!
        actualizarTorneo(
            id: ID!
            idVideojuego: ID
            idUsuario: ID
            nombreTorneo: String
            descripcion: String
            tipoTorneo: String
            maxParticipantes: Int
            fechaInicio: String
            fechaFin: String
            status: Boolean
        ): Torneo
        eliminarTorneo(id: ID!): Boolean!

        # Jugadores
        crearJugador(idUsuario: ID!, gamertag: String!): PerfilJugador!
        actualizarJugador(id: ID!, idUsuario: ID, gamertag: String): PerfilJugador
        eliminarJugador(id: ID!): Boolean!

        # Equipos
        crearEquipo(idJugador: ID!, nombreEquipo: String!): Equipo!
        actualizarEquipo(id: ID!, idJugador: ID, nombreEquipo: String): Equipo
        eliminarEquipo(id: ID!): Boolean!

        # Registros a torneos
        crearRegistro(
            idTorneo: ID!
            idJugador: ID!
            idEquipo: ID!
            clasificacion: String = "Pendiente"
            estado: Boolean = true
            fechaRegistro: String
        ): RegistroTorneo!
        actualizarRegistro(
            id: ID!
            idTorneo: ID
            idJugador: ID
            idEquipo: ID
            clasificacion: String
            estado: Boolean
            fechaRegistro: String
        ): RegistroTorneo
        eliminarRegistro(id: ID!): Boolean!

        # Resultados
        crearResultado(idJugador: ID!, puntuacion: Int!, ganador: String!, posicion: Int!): Resultado!
        actualizarResultado(id: ID!, idJugador: ID, puntuacion: Int, ganador: String, posicion: Int): Resultado
        eliminarResultado(id: ID!): Boolean!

        # Partidas
        crearPartida(
            idTorneo: ID!
            idRegistro: ID!
            idResultados: ID!
            numeroRonda: Int!
            numeroPartida: Int!
            posicionActual: Int!
            fecha: String!
            status: Boolean = true
        ): Partida!
        actualizarPartida(
            id: ID!
            idTorneo: ID
            idRegistro: ID
            idResultados: ID
            numeroRonda: Int
            numeroPartida: Int
            posicionActual: Int
            fecha: String
            status: Boolean
        ): Partida
        eliminarPartida(id: ID!): Boolean!

        # Enfrentamientos
        crearEnfrentamiento(idPartida: ID!, idJugador: ID!, posicionActual: Int!): Enfrentamiento!
        actualizarEnfrentamiento(id: ID!, idPartida: ID, idJugador: ID, posicionActual: Int): Enfrentamiento
        eliminarEnfrentamiento(id: ID!): Boolean!

    }

`;

export default typeDefs;
