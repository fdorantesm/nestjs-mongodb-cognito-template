export type HttpServerConfiguration = {
  host?: string;
  name?: string;
  port: number;
  debug?: boolean;
  cors: {
    origins?: string[] | '*';
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: string;
    maxAge?: string;
  };
};
