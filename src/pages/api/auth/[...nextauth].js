import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page URL
  },
  secret: process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
