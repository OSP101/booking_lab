"use client"
import { useState, useEffect, use } from "react";
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link";
import Image from 'next/image'
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import dynamic from 'next/dynamic'
import NavBarOne from "../../components/NavBarOne";
import { Skeleton, Input, Textarea } from "@heroui/react";
import { FaBookmark, FaUserCog } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { Spinner } from "@heroui/react";
import { MdFeedback } from "react-icons/md";

export default function RoomFloorPlan(props) {

  const { data: session, status } = useSession()
  const params = use(props.params)
  const id = params.id;
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const [dataSubject, setDataSubject] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(0);

  const getCheck = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
        },
        body: JSON.stringify({ userid: session.user.id }),
      });
      const dataCheck = await response.json();
      if (dataCheck.length === 0) {
        setIsNotFound(2);
      } else {
        setIsNotFound(1);
      }
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    getCheck();

  }, [status, router])

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/${id}/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);

      }
      const dataUser = await response.json();
      setDataSubject(dataUser.check[0]);
      setIsLoading(true);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  }

  if (session) {
    return (
      status === 'authenticated' &&
      session.user && (
        <>
          <nav className={`fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 ${kanit.className}`}>
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center justify-start rtl:justify-end">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                      ></path>
                    </svg>
                  </button>
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
                          loading='lazy'
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
                              <Link
                                href="https://bookinglab.featurebase.app/"
                                target='_blank'
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Feedback
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

          <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
            aria-label="Sidebar"
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link href={`/b/${id}`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <FaBookmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className={`ms-3 ${kanit.className}`}>Booking</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/r/${id}`} className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <FaUserCog className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Users</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/s/${id}`} className="flex items-center p-2 pl-4 text-white rounded-lg bg-primary group">
                    <AiFillSetting className="w-5 h-5 text-white" />
                    <span className={`flex-1 ms-3 whitespace-nowrap ${kanit.className}`}>Setting</span>
                  </Link>
                </li>
                <li>
                  <Link href={`https://bookinglab.featurebase.app/`} target="_blank" className="flex items-center p-2 pl-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <MdFeedback className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          <div className="h-screen flex flex-col sm:ml-64">
            <div className={`flex-grow flex flex-col p-4 mt-14 overflow-hidden ${kanit.className}`}>
              <main className={`flex-grow container mx-auto overflow-hidden ${kanit.className}`}>
                {!isLoading ? (
                  LoadingStart()
                ) : isNotFound == 1 ? (
                  <>
                    <Input label="Subject ID" placeholder="Enter your subject ID" type="text" defaultValue={dataSubject?.id} isDisabled />
                    <Textarea className="mt-3" label="Subject name" placeholder="Enter your subject name" defaultValue={dataSubject?.name} isDisabled />
                  </>
                ) : (
                  <NotPage />
                )}
              </main>
              <footer className="py-4 px-4 text-center">
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
          </div>
        </>
      )
    );
  }
  return (
    <LoadingStart />
  );
}

function LoadingStart() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function NotPage() {
  return (
    <div className={`flex h-screen items-center justify-center ${kanit.className}`}>
      <div className="bg-white p-7 rounded-md border">
        <div className="h-24">
          <p className="text-2xl font-light text-gray-600">
            Class not found
          </p>
          <p className="text-sm text-gray-600 font-light mt-2">Look for it on Classes, or double-check your link.</p>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/`}
            className=" bg-blue-500 text-white p-3 rounded text-sm"
          >
            Back to Classes
          </Link>
        </div>
      </div>
    </div>
  )
}