declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    token?: string
  }

  //   interface User {
  //     firstName?: string;
  //     lastName?: string;
  //     email?: string | null;
  //     id?: string;
  //     contactAddress?: {
  //       id?: string;
  //     };
  //   }
  // }

  // declare module "next-auth/jwt" {
  //   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  //   interface JWT {
  //     refreshTokenExpires?: number;
  //     accessTokenExpires?: number;
  //     refreshToken?: string;
  //     token: string;
  //     exp?: number;
  //     iat?: number;
  //     jti?: string;
  //   }
}