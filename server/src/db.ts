import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entity/Task";
import { User } from "./entity/User";



export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [Task, User],
  migrations: [],
  subscribers: [],
});
