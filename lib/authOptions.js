import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }
                await connectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("No user found with the given email");
                }
                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
    },
    jwt: {
        maxAge: 60 * 60, // 1 hour
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        singIn: '/auth/login',
        error: '/auth/login',
    }
}