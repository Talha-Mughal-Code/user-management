import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables if .env.test exists
// Otherwise, tests will use default values from config
try {
  config({ path: resolve(__dirname, '../../../.env.test') });
} catch (error) {
  // .env.test is optional
}

