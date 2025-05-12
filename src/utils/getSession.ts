import { getSession as getClientSession } from "next-auth/react";
import { authOptions } from "@/constants/authOptions";
import { getServerSession } from "next-auth/next";

export const getSession = async () => {
  const isClient = typeof window !== "undefined";
  if (isClient) {
    return await getClientSession();
  } else {
    return await getServerSession(authOptions);
  }
};
