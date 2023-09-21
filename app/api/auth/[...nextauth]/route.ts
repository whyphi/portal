import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { signIn } from 'next-auth/react';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  events: {
    createUser: async ({ user }) => {
      // Create user in database
    },
  },
  callbacks: {
    async session({ session, user }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }