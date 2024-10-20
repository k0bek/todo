"use server";

import { AxiosError } from "axios";
import { api } from "../api";
export const addTask = async ({
  text,
  userId,
}: {
  text: string;
  userId: string;
}) => {
  try {
    const response = await api.post("task", {
      text: text,
      userId,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się dodać zadania");
    }
  }
};
