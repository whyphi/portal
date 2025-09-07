import { supabase } from "@/lib/supabase";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    token: {
      id: string;
      email: string;
      name: string;
      is_new_user: boolean;
      roles: string[];
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    is_new_user: boolean;
    roles: string[];
  }
}

async function isValidUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error checking email:", error);
    return false;
  }
  return !!data;
}

async function getUserInfo(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      email,
      name,
      is_new_user,
      user_roles(
        roles (
          name
        )
      )
    `
    )
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
  if (!data) return null;

  const roles =
    data.user_roles?.map((ur: any) => ur.roles?.name).filter(Boolean) ?? [];

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    is_new_user: data.is_new_user,
    roles,
  };
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
      return true;
    },
    async jwt({ token, trigger, account, profile, session }) {
      // TODO: is this necessary?
      if (trigger === "update" && token) {
        const userInfo = await getUserInfo(token.email ?? "");
        // Destructure userInfo and add its properties to the top level of the token
        if (userInfo) {
          const { id, name, email, is_new_user, roles } = userInfo;
          token.id = id;
          token.name = name;
          token.email = email;
          token.is_new_user = is_new_user;
          token.roles = roles;
        }
      }

      if (profile) {
        const userInfo = await getUserInfo(profile.email ?? "");
        // Destructure userInfo and add its properties to the top level of the token
        if (userInfo) {
          const { id, name, email, is_new_user, roles } = userInfo;
          token.id = id;
          token.name = name;
          token.email = email;
          token.is_new_user = is_new_user;
          token.roles = roles;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.token = {
        id: typeof token.id === "string" ? token.id : "",
        email: typeof token.email === "string" ? token.email : "",
        name: typeof token.name === "string" ? token.name : "",
        is_new_user:
          typeof token.is_new_user === "boolean" ? token.is_new_user : false,
        roles: Array.isArray(token.roles) ? token.roles : ["member"],
      };
      return session;
    },
  },
  pages: {
    error: "/authError",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
