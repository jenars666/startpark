import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Admin credentials — all other users are treated as customers
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@starmenspark.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Attach role to the session
        (session.user as { role?: string }).role =
          session.user.email === ADMIN_EMAIL ? "admin" : "user";
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
