import React from 'react'
import { useSession, signOut } from 'next-auth/react'
export default function MenuItem() {
      const { data: session, status } = useSession()
    return (
        <div
            className="absolute top-12 right-4 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown"
        >
            <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                    {session.user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {session.user.email}
                </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-default"
                    >
                        Profile
                    </Link>
                </li>
                <li>
                    <a
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-default"
                    >
                        Sign out
                    </a>
                </li>
            </ul>
        </div>
    )
}
