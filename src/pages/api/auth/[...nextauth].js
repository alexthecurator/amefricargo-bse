import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

// Providers
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Let's Signin",
      creadentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await prisma.User.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            Password: {
              select: {
                password: true,
              },
            },
          },
        });

        console.log(user);

        if (user) {
          // Extract password
          const found = user.Password[0].password;
          // Match password if correct
          if (found === password) {
            delete user.Accounts; // remove accounts from returning payload
            return user;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
};

export default NextAuth(authOptions);
