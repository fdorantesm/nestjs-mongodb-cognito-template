import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Fallback to .env if .env.test doesn't have all variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
