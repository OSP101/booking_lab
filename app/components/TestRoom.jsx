"use client"
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'


export default function RoomFloorPlan() {

  const [roomData, setRoomData] = useState({
    roomId: "9226",
    tables: [
      { id: 1, x: 50, y: 100, status: "available" },
      { id: 2, x: 150, y: 100, status: "available" },
      { id: 10, x: 250, y: 200, status: "in-progress" },
      { id: 11, x: 350, y: 200, status: "in-progress" },
      { id: 12, x: 450, y: 200, status: "done" }
    ]
  });

  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])


  return (
    <div className="relative w-full h-[600px] border bg-gray-100">
      <div
        className={`absolute flex items-center justify-center w-full h-16 border rounded-lg bg-sky-200`}
        style={{
          left: `50px`,
          top: `10px`
        }}
      >
        <p>หน้าห้อง</p>
      </div>
      {roomData.tables.map((table) => (
        <div
          key={table.id}
          className={`absolute flex items-center justify-center w-16 h-16 border rounded-lg 
            ${table.status === "available"
              ? "bg-green-200"
              : table.status === "in-progress"
                ? "bg-yellow-200"
                : table.status === "done"
                  ? "bg-gray-400"
                  : "bg-red-200"
            }`}
          style={{
            left: `${table.x}px`,
            top: `${table.y}px`
          }}
        >
          <p>{table.id}</p>
        </div>
      ))}
    </div>
  );
}
