import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

import pool from './config/database.js';

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {

    try {

        // Comprobar conexión con MySQL
        await pool.query('SELECT 1');

        console.log('Conexión con MySQL establecida correctamente');

        // Iniciar Apollo Server
        await server.start();

        // Configurar GraphQL en Express
        app.use(
            '/graphql',
            cors(),
            express.json(),
            expressMiddleware(server)
        );

        app.listen(PORT, () => {

            console.log('Servidor iniciado correctamente');

            console.log(`Servidor: http://localhost:${PORT}`);

            console.log(`GraphQL: http://localhost:${PORT}/graphql`);

        });

    } catch (error) {

        console.error('Error al iniciar el servidor:', error.message);

        process.exit(1);

    }

}

iniciarServidor();