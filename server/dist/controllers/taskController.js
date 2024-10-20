"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.deleteTask = exports.createTask = exports.getTasks = void 0;
const joi_1 = __importDefault(require("joi"));
const Task_1 = require("../entity/Task");
const db_1 = require("../db");
const User_1 = require("../entity/User");
const createTaskSchema = joi_1.default.object({
    text: joi_1.default.string().required().min(1).max(255),
    userId: joi_1.default.string()
        .guid({ version: ["uuidv4"] })
        .required(),
});
const deleteTaskSchema = joi_1.default.object({
    id: joi_1.default.string()
        .guid({ version: ["uuidv4"] })
        .required(),
});
const updateTaskSchema = joi_1.default.object({
    text: joi_1.default.string().min(1).max(255),
    is_checked: joi_1.default.boolean(),
});
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const taskRepository = db_1.AppDataSource.getRepository(Task_1.Task);
        const tasks = yield taskRepository.find({
            where: { user: { id: userId } },
            order: { order_position: "ASC" },
        });
        res.json(tasks);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createTaskSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { text, userId } = value;
        const taskRepository = db_1.AppDataSource.getRepository(Task_1.Task);
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOneBy({ id: userId });
        if (!user) {
            res.status(404).json({ error: "Nie znaleziono użytkownika." });
            return;
        }
        const maxOrderTask = yield taskRepository
            .createQueryBuilder("task")
            .select("MAX(task.order_position)", "max")
            .where("task.userId = :userId", { userId })
            .getRawOne();
        const order_position = ((maxOrderTask === null || maxOrderTask === void 0 ? void 0 : maxOrderTask.max) || 0) + 1;
        const newTask = taskRepository.create({
            text,
            is_checked: false,
            created_at: new Date(),
            order_position,
            user,
        });
        yield taskRepository.save(newTask);
        res.status(201).json(newTask);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = deleteTaskSchema.validate(req.params);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { id } = value;
        const taskRepository = db_1.AppDataSource.getRepository(Task_1.Task);
        const taskToDelete = yield taskRepository.findOneBy({ id });
        if (!taskToDelete) {
            res.status(404).json({ error: "Nie znaleziono zadania." });
            return;
        }
        yield taskRepository.remove(taskToDelete);
        res.status(200).json(taskToDelete);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
});
exports.deleteTask = deleteTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = updateTaskSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { text, is_checked } = value;
        const { id } = req.params;
        const taskRepository = db_1.AppDataSource.getRepository(Task_1.Task);
        const taskToUpdate = yield taskRepository.findOneBy({ id });
        if (!taskToUpdate) {
            res.status(404).json({ error: "Nie znaleziono zadania." });
            return;
        }
        if (text !== undefined)
            taskToUpdate.text = text;
        if (is_checked !== undefined)
            taskToUpdate.is_checked = is_checked;
        yield taskRepository.save(taskToUpdate);
        res.status(200).json(taskToUpdate);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
});
exports.updateTask = updateTask;
