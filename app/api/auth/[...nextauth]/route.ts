import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

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
    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user, account, profile, email, credentials })
      // Pseudocode IMPLEMENT LATER
      // if (profile && profile.email not in database) {
      //   console.log("Not a PCT member email")
      //   return false;
      // }

      // set cookie of user.id_token to browser

      return true
    },
    async session({ session, user, token }) {
      return session
    },

  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }