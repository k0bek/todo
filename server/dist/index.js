"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const db_1 = require("./db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
const port = 5001;
app.use("/task", taskRoutes_1.default);
app.use("/user", userRoutes_1.default);
db_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
