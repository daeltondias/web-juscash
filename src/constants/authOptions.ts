// https://authjs.dev/guides/refresh-token-rotation

import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { api, apiAlt } from "@/lib/axios";
import { cache } from "@/cache";

type TokensType = {
  access_token: string;
  access_token_expires: string;
  refresh_token: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const response = await api("/sign-in", {
          method: "POST",
          data: credentials,
        });
        return response.data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, session, user }) {
      const data = session || user;
      if (data) {
        token.access_token = data.access_token;
        token.access_token_expires = data.access_token_expires;
        token.refresh_token = data.refresh_token;
        token.user = data.user;
      }
      if (token.access_token_expires && !cache.fetchingRefreshToken) {
        const expirationTime = new Date(token.access_token_expires).getTime();
        const now = new Date().getTime();
        if (now > expirationTime) {
          try {
            cache.fetchingRefreshToken = true;
            const refresh_token = token.refresh_token;
            const response = await apiAlt.post<TokensType>(
              "/auth/refresh-token",
              { refresh_token }
            );
            token.access_token = response.data.access_token;
            token.access_token_expires = response.data.access_token_expires;
            token.refresh_token = response.data.refresh_token;
          } catch {
            console.error("Failed to refresh token");
            token.error = "RefreshTokenError";
          } finally {
            cache.fetchingRefreshToken = false;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.error = token.error;
        session.access_token = token.access_token;
        session.access_token_expires = token.access_token_expires;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
      }
      return session;
    },
  },
};

// export const useAuth = NextAuth(authOptions)
