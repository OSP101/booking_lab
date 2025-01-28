'use client'
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from "@heroui/skeleton";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function NavBar() {
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    status === 'authenticated' &&
    session.user && (
      <nav className={`fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 ${kanit.className}`}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center justify-start rtl:justify-end">
              <Link href={"/"} className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                Booking Lab
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
              {session?.user ? (
                <>
                  {/* Profile Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      src={session.user.image || "/mind-4eve.png"}
                      width={30}
                      height={30}
                      alt="User profile"
                      className="rounded-full"
                      loading = 'lazy'
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute top-12 right-4 z-50 bg-white text-gray-700 divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:divide-gray-600"
                      id="user-dropdown"
                    >
                      <div className="px-4 py-3">
                        <span className="block text-sm font-medium">{session.user.name}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</span>
                      </div>
                      <ul className="py-2">
                        <li>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <a
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Skeleton className="w-7 h-7 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  )
}
