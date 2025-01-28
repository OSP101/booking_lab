'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NavBar from "../components/NavBar";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function Profile() {
    const { data: session, status } = useSession()

    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status, router])

    // When after loading success and have session, show profile
    return (
        status === 'authenticated' &&
        session.user && (
            <>
            <NavBar/>
            <div className={`flex h-screen items-center justify-center ${kanit.className}`}>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="text-center mb-4">
                        <Image
                            src={session.user.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                            className="rounded-full mx-auto"
                            alt="Profile Picture"
                            width={200}
                            height={200}
                        />
                    </div>
                    <p>
                        Welcome, <b>{session.user.name}!</b>
                    </p>
                    <p>Email: {session.user.email}</p>
                    <p>Role: {session.user.role}</p>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full bg-blue-500 text-white py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
            </>
        )
    )
}