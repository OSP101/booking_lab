import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-400'>
        <Image src={`/computer_GIF.gif`} width={200} height={40} alt='computer gif'/>
    </div>
  )
}
