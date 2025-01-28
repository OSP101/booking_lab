import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
    try {

        const token = request.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { email, password, name, role, image } = await request.json()
        const hashedPassword = bcrypt.hashSync(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                image
            },
        })
        return Response.json({ message: 'User created', user })
    } catch (error) {
        return Response.json({ error: 'User could not be created' })
    }
}