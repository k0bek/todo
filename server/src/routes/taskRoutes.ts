import Router from "express";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);

export default router;
