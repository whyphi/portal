import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoClient, ServerApiVersion } from 'mongodb'

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.9gtht.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function isValidUser(email: string) {
  await client.connect();
  const db = client.db("vault");
  const user = await db.collection('users').findOne({ email: email });
  try {
    if (user) return true;
    else return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  } finally {
    await client.close();
  }
}

const authOptions: AuthOptions = {
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
      if (profile) {
        return await isValidUser(profile.email as string);
      }
      return true
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token
      //   token.id = profile.id
      // }
      token.test = "sdmfksmk"
      return token
    },
    async session({ session, user, token }) {
      session.token = token;
      return session
    },

  },
  pages: {
    error: "/authError"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }