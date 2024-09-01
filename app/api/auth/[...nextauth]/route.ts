import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

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
    return !!user;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  } finally {
    await client.close();
  }
}

async function getUserInfo(email: string) {
  await client.connect();
  const db = client.db("vault");
  const user = await db.collection('users').findOne({ email: email });
  try {
    return user || null;
  } catch (error) {
    console.error('Error checking email:', error);
    return null;
  } finally {
    await client.close();
  }
}

const adminAuthOptions: AuthOptions = {
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
    async jwt({ token, trigger, account, profile, session }) {
      if (trigger === "update" && token) {
        const userInfo = await getUserInfo(token.email ?? '');
        // Destructure userInfo and add its properties to the top level of the token
        if (userInfo) {
          const { _id, name, email, isNewUser, role } = userInfo;
          token._id = _id;
          token.name = name;
          token.email = email;
          token.isNewUser = isNewUser;
          token.role = role;
        }
      }

      if (profile) {
        const userInfo = await getUserInfo(profile.email ?? '');

        // Destructure userInfo and add its properties to the top level of the token
        if (userInfo) {
          const { _id, name, email, isNewUser, role } = userInfo;
          token._id = _id;
          token.name = name;
          token.email = email;
          token.isNewUser = isNewUser;
          token.role = role;
        }
      }
      return token;
    },
    async session({ session, user, token }) {
      (session as any).token = token; // Type assertion
      return session;
    },

  },
  pages: {
    error: "/authError"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const publicAuthOptions: AuthOptions = {
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
      if (profile && profile.email) {
        return profile.email.endsWith("@bu.edu")
      }
      return false;
    },

  },
  // pages: {
  //   error: "/authError"
  // },
  secret: process.env.NEXTAUTH_SECRET
};

// const handler = NextAuth(adminAuthOptions);
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the path to decide which auth options to use
  const isPublicPath = req.url?.startsWith('/api/auth/public');

  const authOptions = isPublicPath ? publicAuthOptions : adminAuthOptions;
  return NextAuth(req, res, authOptions);
};


export { handler as GET, handler as POST }