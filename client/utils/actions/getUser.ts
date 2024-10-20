"use server";

import { AxiosError } from "axios";
import { api } from "../api";

export const getUser = async ({ userId }: { userId: string }) => {
  try {
    const response = await api.get("user", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się pobrać użytkownika");
    }
  }
};
