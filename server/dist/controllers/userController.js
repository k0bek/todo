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
exports.getUser = exports.createUser = void 0;
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db");
const User_1 = require("../entity/User");
const createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(2).max(50),
});
const getUserSchema = joi_1.default.object({
    userId: joi_1.default.string()
        .guid({ version: ["uuidv4"] })
        .required(),
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createUserSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { name } = value;
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const existingUser = yield userRepository.findOneBy({ name });
        if (existingUser) {
            res.json(existingUser);
            return;
        }
        const newUser = userRepository.create({
            id: (0, uuid_1.v4)(),
            name,
        });
        yield userRepository.save(newUser);
        res.status(201).json(newUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwra." });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = getUserSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { userId } = value;
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOneBy({ id: userId });
        if (!user) {
            res.status(404).json({ error: "Nie znaleziono uzytkownika." });
            return;
        }
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwra." });
    }
});
exports.getUser = getUser;
