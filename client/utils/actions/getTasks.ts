"use server";

import { AxiosError } from "axios";
import { api } from "../api";

export const getTasks = async ({ userId }: { userId: string }) => {
  try {
    const response = await api.get("task", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się pobrać zadań");
    }
  }
};
