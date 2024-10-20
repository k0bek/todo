"use server";

import { AxiosError } from "axios";
import { api } from "../api";
export const addName = async ({ name }: { name: string }) => {
  try {
    const response = await api.post("user", {
      name,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się dodać imienia");
    }
  }
};
