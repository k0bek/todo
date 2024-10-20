"use server";

import { AxiosError } from "axios";
import { api } from "../api";
export const deleteTask = async ({ id }: { id: string }) => {
  try {
    const response = await api.delete("task/" + id, {});
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się usunąć zadania");
    }
  }
};
