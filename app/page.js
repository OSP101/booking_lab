"use client"
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import dynamic from 'next/dynamic'
import NavBar from "./components/NavBar";
import { Spinner } from "@heroui/react";
const CardMain = dynamic(
  () => import('./components/Cards/CardMain'),
  {
    loading: () => LoadingStart(),
  }
)
export default function RoomFloorPlan() {

  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  if (session) {
    return (
      <>
        <NavBar />
        <div className={`min-h-screen flex flex-col ${kanit.className}`}>
          <main className='flex-grow container mx-auto pt-20'>
            <CardMain />
          </main>
          <footer className="py-6 px-4 text-center">
            <p className="text-xs font-light text-gray-400">
              © 2024 Booking Lab v{process.env.NEXT_PUBLIC_VERSION}
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              {' '}All Rights Reserved.{' '}Made with ❤️ by{' '}
              <Link href="https://github.com/saitoarm" target="_blank" className="hover:text-sky-700">
                SaitoArm
              </Link>
              {' & '}
              <Link href="https://github.com/OSP101" target="_blank" className="hover:text-sky-700">
                OSP101
              </Link>
            </p>
          </footer>
        </div>

      </>
    );
  }
  return (
    <>
      <NavBar />
      <LoadingStart/>
    </>
  );
}

function LoadingStart() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
