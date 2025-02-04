"use client"
import { useState, useEffect } from "react";
import { User, Tooltip, Chip, Switch, cn } from "@heroui/react";
import { FaBusinessTime } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";

export default function LabStatus() {

  const [roomData, setRoomData] = useState({
    roomId: "9226",
    tables: [
      { id: 1, name: 1, x: 615, y: 80, col: 6, rows: 1, zone: "C" },
      { id: 2, name: 2, x: 665, y: 80, col: 7, rows: 1, zone: "C"},

      { id: 3, name: 3, x: 319, y: 130, col: 1, rows: 2, zone: "A" },
      { id: 4, name: 4, x: 370, y: 130, col: 2, rows: 2, zone: "A" },
      { id: 5, name: 5, x: 420, y: 130, col: 3, rows: 2, zone: "A" },
      { id: 6, name: 6, x: 495, y: 130, col: 4, rows: 2, zone: "B" },
      { id: 7, name: 7, x: 545, y: 130, col: 5, rows: 2, zone: "B" },
      { id: 8, name: 8, x: 615, y: 130, col: 6, rows: 2, zone: "C" },
      { id: 9, name: 9, x: 665, y: 130, col: 7, rows: 2, zone: "C" },

      { id: 10, name: 10, x: 319, y: 180, col: 1, rows: 3, zone: "A" },
      { id: 11, name: 11, x: 370, y: 180, col: 2, rows: 3, zone: "A" },
      { id: 12, name: 12, x: 420, y: 180, col: 3, rows: 3, zone: "A" },
      { id: 13, name: 13, x: 495, y: 180, col: 4, rows: 3, zone: "B" },
      { id: 14, name: 14, x: 545, y: 180, col: 5, rows: 3, zone: "B" },
      { id: 15, name: 15, x: 615, y: 180, col: 6, rows: 3, zone: "C" },
      { id: 16, name: 16, x: 665, y: 180, col: 7, rows: 3, zone: "C" },

      { id: 17, name: 17, x: 319, y: 230, col: 1, rows: 4, zone: "A" },
      { id: 18, name: 18, x: 370, y: 230, col: 2, rows: 4, zone: "A" },
      { id: 19, name: 19, x: 420, y: 230, col: 3, rows: 4, zone: "A" },
      { id: 20, name: 20, x: 495, y: 230, col: 4, rows: 4, zone: "B" },
      { id: 21, name: 21, x: 545, y: 230, col: 5, rows: 4, zone: "B" },
      { id: 22, name: 22, x: 615, y: 230, col: 6, rows: 4, zone: "C" },
      { id: 23, name: 23, x: 665, y: 230, col: 7, rows: 4, zone: "C" },

      { id: 24, name: 24, x: 319, y: 280, col: 1, rows: 5, zone: "A" },
      { id: 25, name: 25, x: 370, y: 280, col: 2, rows: 5, zone: "A" },
      { id: 26, name: 26, x: 420, y: 280, col: 3, rows: 5, zone: "A" },
      { id: 27, name: 27, x: 495, y: 280, col: 4, rows: 5, zone: "B" },
      { id: 28, name: 28, x: 545, y: 280, col: 5, rows: 5, zone: "B" },
      { id: 29, name: 29, x: 615, y: 280, col: 6, rows: 5, zone: "C" },
      { id: 30, name: 30, x: 665, y: 280, col: 7, rows: 5, zone: "C" },

      { id: 31, name: 31, x: 319, y: 330, col: 1, rows: 6, zone: "A" },
      { id: 32, name: 32, x: 370, y: 330, col: 2, rows: 6, zone: "A" },
      { id: 33, name: 33, x: 420, y: 330, col: 3, rows: 6, zone: "A" },
      { id: 34, name: 34, x: 495, y: 330, col: 4, rows: 6, zone: "B" },
      { id: 35, name: 35, x: 545, y: 330, col: 5, rows: 6, zone: "B" },
      { id: 36, name: 36, x: 615, y: 330, col: 6, rows: 6, zone: "C" },
      { id: 37, name: 37, x: 665, y: 330, col: 7, rows: 6, zone: "C" },

      { id: 38, name: 38, x: 319, y: 380, col: 1, rows: 7, zone: "A" },
      { id: 39, name: 39, x: 370, y: 380, col: 2, rows: 7, zone: "A" },
      { id: 40, name: 40, x: 420, y: 380, col: 3, rows: 7, zone: "A" },
      { id: 41, name: 41, x: 495, y: 380, col: 4, rows: 7, zone: "B" },
      { id: 42, name: 42, x: 545, y: 380, col: 5, rows: 7, zone: "B" },
      { id: 43, name: 43, x: 615, y: 380, col: 6, rows: 7, zone: "C" },
      { id: 44, name: 44, x: 665, y: 380, col: 7, rows: 7, zone: "C" },

      { id: 45, name: 45, x: 319, y: 430, col: 1, rows: 8, zone: "A" },
      { id: 46, name: 46, x: 370, y: 430, col: 2, rows: 8, zone: "A" },
      { id: 47, name: 47, x: 420, y: 430, col: 3, rows: 8, zone: "A" },
      { id: 48, name: 48, x: 495, y: 430, col: 4, rows: 8, zone: "B" },
      { id: 49, name: 49, x: 545, y: 430, col: 5, rows: 8, zone: "B" },
      { id: 50, name: 50, x: 615, y: 430, col: 6, rows: 8, zone: "C" },
      { id: 51, name: 51, x: 665, y: 430, col: 7, rows: 8, zone: "C" },

      { id: 52, name: 52, x: 319, y: 480, col: 1, rows: 9, zone: "A" },
      { id: 53, name: 53, x: 370, y: 480, col: 2, rows: 9, zone: "A" },
      { id: 54, name: 54, x: 420, y: 480, col: 3, rows: 9, zone: "A" },
      { id: 55, name: 55, x: 495, y: 480, col: 4, rows: 9, zone: "B" },
      { id: 56, name: 56, x: 545, y: 480, col: 5, rows: 9, zone: "B" },

      { id: 57, name: 57, x: 319, y: 530, col: 1, rows: 10, zone: "A" },
      { id: 58, name: 58, x: 370, y: 530, col: 2, rows: 10, zone: "A" },
      { id: 59, name: 59, x: 420, y: 530, col: 3, rows: 10, zone: "A" },
      { id: 60, name: 60, x: 495, y: 530, col: 4, rows: 10, zone: "B" },
      { id: 61, name: 61, x: 545, y: 530, col: 5, rows: 10, zone: "B" },
    ]
  });

  const queue = [
    { table: 23, studentId: "633020334-8", status: "in-progress", time: "21/01/2025 22:01:21" },
    { table: 3, studentId: "633020333-8", status: "in-progress", time: "21/01/2025 22:50:21" },
    { table: 49, studentId: "633020284-8", status: "available", time: "21/01/2025 22:59:21" },
  ];
// อัปเดตสถานะโต๊ะจาก queue
const updateTableStatus = () => {
  const updatedTables = roomData.tables.map((table) => {
    const queueItem = queue.find((q) => q.table === table.id);
    return queueItem
      ? { ...table, status: queueItem.status }
      : { ...table, status: "done" };
  });
  setRoomData({ ...roomData, tables: updatedTables });
};

// อัปเดตสถานะโต๊ะทันทีเมื่อ component render
useState(() => {
  updateTableStatus();
}, []);

const [isSelected, setIsSelected] = useState(true);

return (
  <div className="h-screen bg-gray-100 flex items-end justify-center">
    <div className="bg-white h-[90%] p-6 rounded-xl shadow-md flex w-[98%]">
      {/* Left Panel: Tables */}
      <div className="w-3/4 p-4 relative">
        <div className="bg-cyan-500 text-white text-center py-2 rounded">
          <h2 className="text-lg font-bold">Screen</h2>
        </div>
        <div className="grid grid-cols-12 gap-2 mt-4">
          {roomData.tables.map((table) => (
            <div
              key={table.id}
              className={`absolute flex items-center justify-center w-11 h-11 border rounded-lg 
          ${
            table.status === "available"
              ? "bg-green-200"
              : table.status === "in-progress"
              ? "bg-yellow-200"
              : table.status === "done"
              ? "bg-gray-400"
              : "bg-red-200"
          }`}
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
              }}
            >
              <p>{table.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Details */}
      <div className="w-1/4 pl-6 h-[100%]">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          {/* Lab Information */}
          <div>
            <User
              avatarProps={{ radius: "lg", src: "/mind-4eve-1.png" }}
              description="SC363204 Java Web Application Development"
              name="Lab 03"
            >
              Lab 03
            </User>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-600">Date:</p>
              <p className="text-sm font-medium">21/01/2025 22:01:21</p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-600">Room:</p>
              <p className="text-sm font-medium">9226</p>
            </div>
            <Switch
              isSelected={isSelected}
              onValueChange={setIsSelected}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-2 mt-2 border-2 border-transparent",
                  "data-[selected=true]:border-primary"
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                  "w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ms-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ms-4"
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">{isSelected ? "Active" : "Inactive"}</p>
                <p className="text-tiny text-default-400">
                  {isSelected ? "Booking is now open." : "Booking is now closed."}
                </p>
              </div>
            </Switch>
          </div>

          {/* Queue List */}
          <div className="mt-5">
            <h3 className="font-bold text-lg">Queue</h3>
            <div className="mt-4">
              {queue.map((q, index) => (
                q.status == "in-progress" &&
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 mb-2 rounded-lg shadow ${
                    q.status === "available" ? "bg-green-200" : "bg-yellow-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`font-bold w-10 text-center ${
                        q.status === "available" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {q.table}
                    </span>
                    <div>
                      <p className="text-sm">{q.studentId}</p>
                      <p className="text-xs text-gray-600 font-sans">{q.time}</p>
                    </div>
                  </div>
                  <p className="font-bold w-10 text-end text-yellow-600">{}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}