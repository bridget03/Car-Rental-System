import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";
import messages from "@/utils/messageList";
import { usersPath } from "@/utils/mockdataPath";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(`${messages.M003}: email and password`);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error(messages.ME002);
        }

        const file = await fs.readFile(usersPath, "utf8");
        const users = JSON.parse(file);

        let user = users.find((u: any) => u.email === credentials.email);
        if (!user) {
          throw new Error(messages.ME001);
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error(messages.ME001);
        }

        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user ;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
