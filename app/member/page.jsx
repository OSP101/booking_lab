"use client"
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import dynamic from 'next/dynamic'
const UserTable = dynamic(
  () => import('../components/admin/UserTable'),
  {
    loading: () => <p>Loading...</p>,
  }
)
export default function RoomFloorPlan() {

  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session) {
      if (session?.user?.role !== 'admin') {
        router.push('/')
      }
    }
  }, [status, router, session])

  if (session && session.user.role === 'admin') {
    return (
      <div className={`min-h-screen flex flex-col ${kanit.className}`}>
        <main className='flex-grow container mx-auto pt-20'>
          <UserTable />
        </main>
        <footer className="py-6 px-4 text-center">
            <p className="flex items-center justify-center gap-2">
              © 2024 Booking Lab v1.0.5
              <span className="w-1 h-1 bg-white rounded-full" />
              All Rights Reserved. Made with ❤️ by{' '}
              <Link href="https://github.com/saitoarm" target="_blank" className="hover:text-sky-700">
                Saitoarm
              </Link>
              {' & '}
              <Link href="https://github.com/OSP101" target="_blank" className="hover:text-sky-700">
                OSP101
              </Link>
            </p>
          </footer>
      </div>
    );
  }
  return (
    <div className={`min-h-screen flex flex-col ${kanit.className}`}>

    </div>
  );
}
