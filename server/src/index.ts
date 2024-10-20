import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import { AppDataSource } from "./db";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const port = 5001;

app.use("/task", taskRoutes);
app.use("/user", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
