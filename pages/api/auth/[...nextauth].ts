import NextAuth from "next-auth";

import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Providers.Email({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
