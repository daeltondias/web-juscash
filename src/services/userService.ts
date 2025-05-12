import { AxiosResponse } from "axios";
import { api } from "@/lib/axios";

type ServiceType = {
  signIn: (data: { email: string; password: string }) => Promise<AxiosResponse>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<AxiosResponse>;
};

export const userService: ServiceType = {
  signIn: async (data) => {
    return api({
      method: "POST",
      url: "/sign-in",
      data,
    });
  },
  signUp: async (data) => {
    return api({
      method: "POST",
      url: "/sign-up",
      data,
    });
  },
};
