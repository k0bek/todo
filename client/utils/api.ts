import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "http://host.docker.internal:5001/",
  headers: {
    "Content-Type": "application/json",
  },
});
