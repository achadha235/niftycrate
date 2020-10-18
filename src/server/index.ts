import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { parse } from 'url';
import next from 'next';
import bodyParser from 'body-parser';
import config from '../../config';
import helmet from 'helmet';
import typeDefs from '../gql/typeDefs';
import resolvers from '../gql/resolvers';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { setConfig } from 'next/config';
import getConfig from 'next/config';
import database, { AppModel, AppDBConnection, AppDBConfig } from '../db';
import { startBlockchainServer, needsMigration } from '../services/ganache';

if (config.NODE_ENV === 'production') {
  require('@google-cloud/debug-agent').start({ allowExpressions: true });
}

const sixtyDaysInSeconds = 5184000;
const port = config.PORT;
const dev = config.NEXT_DEV;
const app = next({ dev });
const handle = app.getRequestHandler();

// Start dev blockchain
if (config.NODE_ENV === 'development') {
  // startBlockchainServer(needsMigration());
}

export interface AppConfig {
  dbConfig: AppDBConfig;
  models: AppModel;
  connection: AppDBConnection;
  serverRuntimeConfig: typeof config;
}

export interface GQLContext {
  models: AppModel;
  req: Express.Request;
  res: Express.Response;
}

const securityPolicy = {
  directives: {
    defaultSrc: ["'unsafe-eval'", "'unsafe-inline'", '*'],
    frameAncestors: ["'self'", 'https://niftycrates.co'],
    imgSrc: ["'self'", 'data:', "'unsafe-inline'", '*'],
  },
};

export const server = app.prepare().then(async () => {
  let models: AppModel;
  let connection: AppDBConnection;
  try {
    const db = await database;
    models = db.models;
    connection = db.connection;
    setConfig({
      ...getConfig(),
      models,
      connection,
    });

    console.info('Connected to database', db.dbConfig);
  } catch (err) {
    console.error(err);
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      req,
      res,
      models,
    }),
  } as any);

  const server = express();
  server.set('trust proxy', true);
  server.use(cors());
  server.use(compression());
  server.use(cookieParser());
  server.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  server.use(bodyParser.json({ limit: '50mb' }));
  server.use(compression());
  server.use(helmet.xssFilter());
  server.use(helmet.frameguard());
  server.use(helmet.noSniff());

  server.use(
    helmet.hsts({
      maxAge: sixtyDaysInSeconds,
    })
  );
  server.use(helmet.contentSecurityPolicy(securityPolicy));
  apolloServer.applyMiddleware({
    app: server,
    cors: {
      origin: [/\.cloudshell\.dev$/],
    },
  });

  const httpServer = http.createServer(server);

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log('Started with', getConfig().serverRuntimeConfig);
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});
