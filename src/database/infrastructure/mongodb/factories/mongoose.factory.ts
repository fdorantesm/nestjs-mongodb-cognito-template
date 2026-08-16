import { Environment } from '@/core/domain/enums/environment.enum';
import { DatabaseConnection } from '@/core/infrastructure/types';
import { MongooseConnectionFactory } from '@/database/infrastructure/mongodb/factories/mongoose-connection.factory';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConnectionString } from 'connection-string';
import mongoose from 'mongoose';

@Injectable()
export class MongooseFactory implements MongooseOptionsFactory {
  protected config: DatabaseConnection;

  constructor(private readonly configService: ConfigService) {
    this.config = configService.get<DatabaseConnection>('database');
  }

  public createMongooseOptions(): MongooseModuleOptions {
    const uri = new ConnectionString('', {
      user: this.config.username,
      password: this.config.password,
      protocol: this.config.port ? 'mongodb' : 'mongodb+srv',
      hosts: [{ name: this.config.host, port: this.config.port }],
    }).toString();

    const { createForInstance } = MongooseConnectionFactory;

    const environemnt = this.configService.get<Environment>(
      'environment.nodeEnv',
    );

    if (environemnt === Environment.DEVELOPMENT) {
      mongoose.set('debug', (collectionName, method, query) => {
        Logger.log(JSON.stringify(query), `${collectionName}.${method}`);
      });
    }

    return {
      uri,
      dbName: this.config.database,
      connectionFactory: createForInstance,
    };
  }
}
