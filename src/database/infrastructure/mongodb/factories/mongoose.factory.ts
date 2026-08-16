import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConnectionString } from 'connection-string';
import mongoose from 'mongoose';

import { DatabaseConnection } from '@/core/infrastructure/types';
import { MongooseConnectionFactory } from '@/database/infrastructure/mongodb/factories/mongoose-connection.factory';
import type { EnvironmentConfig } from '@/core/infrastructure/types/environment/environment.type';
import { RequestContextService } from '@/core/infrastructure/services/request-context.service';

@Injectable()
export class MongooseFactory implements MongooseOptionsFactory {
  protected config: DatabaseConnection;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestContextService: RequestContextService,
  ) {
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

    const { isDebug } =
      this.configService.get<EnvironmentConfig>('environment');

    if (isDebug) {
      mongoose.set('debug', (collectionName, method, query) => {
        const requestId = this.requestContextService.getRequestId();
        const context = requestId || 'Mongoose';

        Logger.debug(
          `Query ${collectionName}.${method}(${JSON.stringify(query)})`,
          context,
        );
      });
    }

    return {
      uri,
      dbName: this.config.database,
      connectionFactory: createForInstance,
    };
  }
}
