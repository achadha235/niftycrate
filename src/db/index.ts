import {
  createConnection,
  Connection,
  Repository,
  ConnectionOptions,
} from 'typeorm';
import dbConfig from '../../ormconfig';
import User from '../entity/User';

let db: AppDB;

export interface AppModel {
  User: Repository<User>;
}

export type AppDBConnection = Connection;

export interface AppDB {
  dbConfig: AppDBConfig;
  connection: Connection;
  models: AppModel;
}

export type AppDBConfig = ConnectionOptions;

export default (async () => {
  if (db) return db;
  let connection, models;
  // connection = await createConnection({
  //   host: dbConfig.host,
  //   database: dbConfig.database,
  //   type: 'postgres',
  //   username: dbConfig.username,
  //   password: dbConfig.password,
  //   port: dbConfig.port,
  //   synchronize: true,
  //   logging: true,
  //   entities: [User],
  // });

  models = {
    // User: connection.getRepository(User),
  };

  return {
    dbConfig,
    connection,
    models,
  } as AppDB;
})();
