"use client"
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import dynamic from 'next/dynamic'
import NavBar from "./components/NavBar";
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
              © 2024{' '}
              <Link href="/" target="_blank" className="hover:text-sky-700">
                Booking Lab
              </Link>
              . All Rights Reserved. Designed by{' '}
              <Link href="https://github.com/saitoarm" target="_blank" className="hover:text-sky-700">
                Saitoarm
              </Link>
              {' & '}
              <Link href="https://github.com/OSP101" target="_blank" className="hover:text-sky-700">
                OSP101
              </Link>
              {' in CP@KKU'}
            </p>
          </footer>
        </div>

      </>
    );
  }
  return (
    <>
      <NavBar />
      <div className={`min-h-screen flex flex-col ${kanit.className}`}>

      </div>
    </>
  );
}

function LoadingStart() {
  <style jsx>{`
    @keyframes text-gradient {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 100% 50%;
      }
    }
  
    .animate-text-gradient {
      animation: text-gradient 3s linear infinite;
    }
  `}</style>
  return (
    <div>
      <p
        className={`inline-flex md:ml-1 font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,#D6009A,#8a56cc,#D6009A)] dark:bg-[linear-gradient(90deg,#FFEBF9,#8a56cc,#FFEBF9)] animate-text-gradient ${kanit.className}`}
        style={{
          fontSize: "2rem",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Loading...
      </p>
    </div>
  )
}
