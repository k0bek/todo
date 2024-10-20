import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "entity", "*.{js,ts}")],
  migrations: [path.join(__dirname, "migration", "*.{js,ts}")],
  subscribers: [path.join(__dirname, "subscriber", "*.{js,ts}")],
});
