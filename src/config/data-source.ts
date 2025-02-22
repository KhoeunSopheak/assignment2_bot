import { DataSource } from "typeorm";
import path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

// Resolve paths for entities and migrations
const entitiesPath = path.resolve(__dirname, "../entity/**/*.{ts,js}");
const migrationPath = path.resolve(__dirname, "./migrations/*.{ts,js}");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432", 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL in production if required
  synchronize: NODE_ENV === "dev", // True only in development
  logging: NODE_ENV === "dev", // Logs SQL queries in development
  entities: [entitiesPath],
  migrations: [migrationPath],
  subscribers: [],
});
