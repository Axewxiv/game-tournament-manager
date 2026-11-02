-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 02-11-2026 a las 23:47:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `torneos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfrentamientos`
--

CREATE TABLE `enfrentamientos` (
  `idEnfrentamientos` int(11) NOT NULL,
  `idPartida` int(11) NOT NULL,
  `idJugador` int(11) NOT NULL,
  `posicionActual` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `enfrentamientos`
--

INSERT INTO `enfrentamientos` (`idEnfrentamientos`, `idPartida`, `idJugador`, `posicionActual`) VALUES
(3, 3, 1, 1),
(4, 4, 2, 1),
(5, 4, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `idEquipo` int(11) NOT NULL,
  `idJugador` int(11) NOT NULL,
  `nombreEquipo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`idEquipo`, `idJugador`, `nombreEquipo`) VALUES
(1, 1, 'Team Axel'),
(3, 2, 'Team Darvin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas`
--

CREATE TABLE `partidas` (
  `idPartidas` int(11) NOT NULL,
  `idTorneo` int(11) NOT NULL,
  `idRegistro` int(11) NOT NULL,
  `idResultados` int(11) NOT NULL,
  `numeroRonda` int(11) NOT NULL,
  `numeroPartida` int(11) NOT NULL,
  `posicionActual` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidas`
--

INSERT INTO `partidas` (`idPartidas`, `idTorneo`, `idRegistro`, `idResultados`, `numeroRonda`, `numeroPartida`, `posicionActual`, `fecha`, `status`) VALUES
(2, 1, 1, 1, 1, 1, 1, '2026-11-10 10:30:00', 1),
(3, 1, 1, 1, 1, 1, 1, '2026-11-10 10:30:00', 1),
(4, 2, 2, 2, 1, 1, 1, '2026-11-10 10:30:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_jugador`
--

CREATE TABLE `perfil_jugador` (
  `idJugador` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `gamertag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil_jugador`
--

INSERT INTO `perfil_jugador` (`idJugador`, `idUsuario`, `gamertag`) VALUES
(1, 2, 'AxelPro'),
(2, 3, 'DarvinPro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_torneo`
--

CREATE TABLE `registro_torneo` (
  `idRegistro` int(11) NOT NULL,
  `idTorneo` int(11) NOT NULL,
  `idJugador` int(11) NOT NULL,
  `idEquipo` int(11) NOT NULL,
  `clasificacion` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `fechaRegistro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_torneo`
--

INSERT INTO `registro_torneo` (`idRegistro`, `idTorneo`, `idJugador`, `idEquipo`, `clasificacion`, `estado`, `fechaRegistro`) VALUES
(1, 1, 1, 1, 'Pendiente', 1, '2026-10-31 20:55:57'),
(2, 2, 2, 3, 'Pendiente', 1, '2026-11-02 16:23:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado_enfrentamientos`
--

CREATE TABLE `resultado_enfrentamientos` (
  `idResultados` int(11) NOT NULL,
  `idJugador` int(11) NOT NULL,
  `puntuacion` int(11) NOT NULL,
  `ganador` varchar(255) NOT NULL,
  `posicion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resultado_enfrentamientos`
--

INSERT INTO `resultado_enfrentamientos` (`idResultados`, `idJugador`, `puntuacion`, `ganador`, `posicion`) VALUES
(1, 1, 100, 'AxelPro', 1),
(2, 2, 99, 'DarvinPro', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `torneos`
--

CREATE TABLE `torneos` (
  `idTorneo` int(11) NOT NULL,
  `idVideojuego` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombreTorneo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `tipoTorneo` varchar(255) NOT NULL,
  `maxParticipantes` int(11) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `torneos`
--

INSERT INTO `torneos` (`idTorneo`, `idVideojuego`, `idUsuario`, `nombreTorneo`, `descripcion`, `tipoTorneo`, `maxParticipantes`, `fechaInicio`, `fechaFin`, `status`) VALUES
(1, 1, 1, 'Copa Otoño', 'Torneo de prueba', 'Eliminación directa', 16, '2026-11-10 10:00:00', '2026-11-10 20:00:00', 1),
(2, 1, 1, 'Copa Invierno', 'Torneo de prueba', 'Eliminación directa', 16, '2026-12-10 10:00:00', '2026-12-10 20:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuario` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `username`, `email`, `password`, `rol`) VALUES
(1, 'admin', 'admin@torneos.com', '123456', 'organizador'),
(2, 'axel', 'axel@torneos.com', '123456', 'jugador'),
(3, 'Brandon', 'Brandon@torneos.com', '$2b$10$GC5SI/FTxUEj2G/ZwqeoWOF2hBeitPJHWc47BX48a1NMya9BTJbp2', 'jugador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videojuego`
--

CREATE TABLE `videojuego` (
  `idVideojuego` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `disponible` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videojuego`
--

INSERT INTO `videojuego` (`idVideojuego`, `nombre`, `descripcion`, `disponible`) VALUES
(1, 'Street Fighter 6', 'Juego de pelea 1 vs 1', 1),
(2, 'Marvel VS Capcom', 'Juego de pelea 1 vs 1', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `enfrentamientos`
--
ALTER TABLE `enfrentamientos`
  ADD PRIMARY KEY (`idEnfrentamientos`),
  ADD KEY `idJugador` (`idPartida`,`idJugador`),
  ADD KEY `idJugador_2` (`idJugador`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`idEquipo`),
  ADD KEY `idJugador` (`idJugador`);

--
-- Indices de la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`idPartidas`),
  ADD KEY `idRegistro` (`idTorneo`,`idRegistro`,`idResultados`),
  ADD KEY `idRegistro_2` (`idRegistro`),
  ADD KEY `idResultados` (`idResultados`);

--
-- Indices de la tabla `perfil_jugador`
--
ALTER TABLE `perfil_jugador`
  ADD PRIMARY KEY (`idJugador`),
  ADD UNIQUE KEY `uq_perfil_gamertag` (`gamertag`),
  ADD KEY `idUsuario` (`idUsuario`) USING BTREE;

--
-- Indices de la tabla `registro_torneo`
--
ALTER TABLE `registro_torneo`
  ADD PRIMARY KEY (`idRegistro`),
  ADD UNIQUE KEY `uq_registro_torneo_jugador` (`idTorneo`,`idJugador`),
  ADD KEY `idEquipo` (`idTorneo`,`idJugador`,`idEquipo`),
  ADD KEY `idJugador` (`idJugador`),
  ADD KEY `idEquipo_2` (`idEquipo`);

--
-- Indices de la tabla `resultado_enfrentamientos`
--
ALTER TABLE `resultado_enfrentamientos`
  ADD PRIMARY KEY (`idResultados`),
  ADD KEY `idJugador` (`idJugador`);

--
-- Indices de la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD PRIMARY KEY (`idTorneo`),
  ADD KEY `idVideojuego` (`idVideojuego`,`idUsuario`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD UNIQUE KEY `uq_usuarios_username` (`username`);

--
-- Indices de la tabla `videojuego`
--
ALTER TABLE `videojuego`
  ADD PRIMARY KEY (`idVideojuego`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `enfrentamientos`
--
ALTER TABLE `enfrentamientos`
  MODIFY `idEnfrentamientos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `idEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `partidas`
--
ALTER TABLE `partidas`
  MODIFY `idPartidas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `perfil_jugador`
--
ALTER TABLE `perfil_jugador`
  MODIFY `idJugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `registro_torneo`
--
ALTER TABLE `registro_torneo`
  MODIFY `idRegistro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `resultado_enfrentamientos`
--
ALTER TABLE `resultado_enfrentamientos`
  MODIFY `idResultados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `torneos`
--
ALTER TABLE `torneos`
  MODIFY `idTorneo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `videojuego`
--
ALTER TABLE `videojuego`
  MODIFY `idVideojuego` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `enfrentamientos`
--
ALTER TABLE `enfrentamientos`
  ADD CONSTRAINT `enfrentamientos_ibfk_1` FOREIGN KEY (`idJugador`) REFERENCES `perfil_jugador` (`idJugador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enfrentamientos_ibfk_2` FOREIGN KEY (`idPartida`) REFERENCES `partidas` (`idPartidas`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `equipo_ibfk_1` FOREIGN KEY (`idJugador`) REFERENCES `perfil_jugador` (`idJugador`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD CONSTRAINT `partidas_ibfk_1` FOREIGN KEY (`idTorneo`) REFERENCES `torneos` (`idTorneo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partidas_ibfk_2` FOREIGN KEY (`idRegistro`) REFERENCES `registro_torneo` (`idRegistro`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `partidas_ibfk_4` FOREIGN KEY (`idResultados`) REFERENCES `resultado_enfrentamientos` (`idResultados`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `perfil_jugador`
--
ALTER TABLE `perfil_jugador`
  ADD CONSTRAINT `perfil_jugador_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `registro_torneo`
--
ALTER TABLE `registro_torneo`
  ADD CONSTRAINT `registro_torneo_ibfk_1` FOREIGN KEY (`idJugador`) REFERENCES `perfil_jugador` (`idJugador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registro_torneo_ibfk_2` FOREIGN KEY (`idEquipo`) REFERENCES `equipo` (`idEquipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registro_torneo_ibfk_3` FOREIGN KEY (`idTorneo`) REFERENCES `torneos` (`idTorneo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `resultado_enfrentamientos`
--
ALTER TABLE `resultado_enfrentamientos`
  ADD CONSTRAINT `resultado_enfrentamientos_ibfk_1` FOREIGN KEY (`idJugador`) REFERENCES `perfil_jugador` (`idJugador`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD CONSTRAINT `torneos_ibfk_1` FOREIGN KEY (`idVideojuego`) REFERENCES `videojuego` (`idVideojuego`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `torneos_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
