import NextAuth from "next-auth";
import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

// Providers
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await prisma.User.findUnique({
          where: {
            email,
          },
          select: {
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

        if (user) {
          // Extract password
          const found = user.Password[0].password;

          const hashed = CryptoJS.SHA512(password).toString(
            CryptoJS.enc.Base64
          );
          // Match password if correct
          if (found === hashed) {
            delete user.Password; // remove password from returning payload
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
  ],

  pages: {
    signIn: "/",
    signOut: "/",
  },
};

export default NextAuth(authOptions);
