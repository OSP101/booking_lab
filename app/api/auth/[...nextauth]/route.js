import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (
                    user &&
                    (await bcrypt.compare(credentials.password, user.password))
                ) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                    }
                } else {
                    console.error('User not found', user)
                    return "null"
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // สำหรับการเข้าสู่ระบบด้วย credentials
            if (account.provider === 'credentials') {
                if(user == "null"){
                    return "/login?status=fail";
                }
                return true;
            }
        },

        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.picture = user.image
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.image = token.picture
            }
            return session
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/`
        },


    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }