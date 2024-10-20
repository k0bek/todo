"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Task_1 = require("./entity/Task");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "soinvu", // Make sure this matches your PostgreSQL username
    password: "root123", // Make sure this is the correct password
    database: "my_first_database",
    synchronize: true,
    logging: false,
    entities: [Task_1.Task, User_1.User],
    migrations: [],
    subscribers: [],
});
