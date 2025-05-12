import { getSession } from "@/utils/getSession";
import axios from "axios";

export const apiAlt = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});
