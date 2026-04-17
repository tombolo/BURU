import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db();

                if (!credentials?.email || !credentials?.password) {
                    console.error('Missing credentials');
                    return null;
                }

                const user = await db.collection('users').findOne({ email: credentials.email });

                if (!user) {
                    console.error('User not found:', credentials.email);
                    return null;
                }

                console.log('User from DB:', user);

                if (!user.password) {
                    console.error('Password is missing from user record');
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                console.log('Password match:', isPasswordCorrect);

                if (!isPasswordCorrect) {
                    console.error('Incorrect password for:', credentials.email);
                    return null;
                }

                console.log('Authorized user:', user.email);

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || '',
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
});
