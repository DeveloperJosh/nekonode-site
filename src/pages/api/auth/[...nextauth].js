import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      await dbConnect();
      const user = await User.findById(token.id);
      
      if (user) {
        session.user.id = user._id;
        session.user.role = user.role;
        session.user.banned = user.banned;
        session.accessToken = token.accessToken;
      } else {
        session.user.role = null;
        session.user.banned = null;
      }
      
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

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          _id: user.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: 'user',
          banned: false,
          //animelist: [],
        });
      }

      if (existingUser.banned) {
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page URL
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',  // Enable debug mode
};

export default NextAuth(authOptions);
