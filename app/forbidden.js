import React from 'react'
import { Prompt } from "next/font/google";
import Link from 'next/link';
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function Forbidden() {
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
