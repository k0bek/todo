import { Request, Response } from "express";
import Joi from "joi";
import { Task } from "../entity/Task";
import { AppDataSource } from "../db";
import { User } from "../entity/User";

const createTaskSchema = Joi.object({
  text: Joi.string().required().min(1).max(255),
  userId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const deleteTaskSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const updateTaskSchema = Joi.object({
  text: Joi.string().min(1).max(255),
  is_checked: Joi.boolean(),
});

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    const taskRepository = AppDataSource.getRepository(Task);

    const tasks = await taskRepository.find({
      where: { user: { id: userId as string } },
      order: { order_position: "ASC" },
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { text, userId } = value;
    const taskRepository = AppDataSource.getRepository(Task);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ error: "Nie znaleziono użytkownika." });
      return;
    }

    const maxOrderTask = await taskRepository
      .createQueryBuilder("task")
      .select("MAX(task.order_position)", "max")
      .where("task.userId = :userId", { userId })
      .getRawOne();

    const order_position = (maxOrderTask?.max || 0) + 1;

    const newTask = taskRepository.create({
      text,
      is_checked: false,
      created_at: new Date(),
      order_position,
      user,
    });

    await taskRepository.save(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = deleteTaskSchema.validate(req.params);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id } = value;
    const taskRepository = AppDataSource.getRepository(Task);

    const taskToDelete = await taskRepository.findOneBy({ id });

    if (!taskToDelete) {
      res.status(404).json({ error: "Nie znaleziono zadania." });
      return;
    }

    await taskRepository.remove(taskToDelete);
    res.status(200).json(taskToDelete);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { text, is_checked } = value;
    const { id } = req.params;
    const taskRepository = AppDataSource.getRepository(Task);

    const taskToUpdate = await taskRepository.findOneBy({ id });

    if (!taskToUpdate) {
      res.status(404).json({ error: "Nie znaleziono zadania." });
      return;
    }

    if (text !== undefined) taskToUpdate.text = text;
    if (is_checked !== undefined) taskToUpdate.is_checked = is_checked;

    await taskRepository.save(taskToUpdate);
    res.status(200).json(taskToUpdate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};
