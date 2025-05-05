


import db from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {

      if (account?.provider !== "credentials") return true;

      await db.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return true;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

  },
  adapter: PrismaAdapter(db),
  session: {
    // strategy: "database",
    strategy: "jwt",
  },
  ...authConfig,
});
