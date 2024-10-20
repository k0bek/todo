import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import { AppDataSource } from "../db";
import { User } from "../entity/User";

const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
});

const getUserSchema = Joi.object({
  userId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { name } = value;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ name });
    if (existingUser) {
      res.json(existingUser);
      return;
    }

    const newUser = userRepository.create({
      id: uuidv4(),
      name,
    });

    await userRepository.save(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwra." });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = getUserSchema.validate(req.query);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { userId } = value;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({ error: "Nie znaleziono uzytkownika." });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwra." });
  }
};
