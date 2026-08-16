import { Connection } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import mongoosePaginate = require('mongoose-paginate-v2');
import { anonymoose } from 'mongoose-anonymoose';

export class MongooseConnectionFactory {
  public static createForInstance(connection: Connection): Connection {
    connection.plugin(anonymoose);
    connection.plugin(mongoosePaginate);
    return connection;
  }
}
