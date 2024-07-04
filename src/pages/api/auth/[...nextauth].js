import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import dotenv from 'dotenv';

dotenv.config();

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async signIn({ user }) {
      await dbConnect();
      
      const existingUser = await User.findOne({ email: user.email });
      
      if (!existingUser) {
        await User.create({
          _id: user.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      
      return true;
    },
  },
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
