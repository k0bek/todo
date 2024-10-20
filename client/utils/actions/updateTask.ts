"use server";

import { AxiosError } from "axios";
import { api } from "../api";
export const updateTask = async ({
  id,
  text,
  is_checked,
}: {
  id: string;
  text: string;
  is_checked: boolean;
}) => {
  try {
    const response = await api.patch("task/" + id, {
      text,
      is_checked,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail);
    } else {
      throw new Error("Nie udało się zaktualizować zadania");
    }
  }
};
