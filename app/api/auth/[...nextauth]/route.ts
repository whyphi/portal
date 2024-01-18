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
      idToken: true
    })
  ],
  events: {
    createUser: async ({ user }) => {
      // Create user in database
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      // TODO: https://stackoverflow.com/questions/73606906/next-auth-how-to-get-google-id-token
      // console.log(token);
      // console.log(account);
      if (account) {
        token.id_token = account.id_token;
        // console.log(token);
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (profile) {
        return await isValidUser(profile.email as string);
      }
      return true
    },
    async session({ session, user, token }) {

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