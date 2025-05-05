import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/auth";
import db from "./lib/db";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password as string
          );

          // if (passwordsMatch) return user;
          if (passwordsMatch)
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }; // 🔴 MUY IMPORTANTE retornar esto
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
