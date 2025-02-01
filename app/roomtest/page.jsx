"use client"
import { useState, useEffect } from "react";
import { User, Tooltip, Chip, Switch, cn } from "@heroui/react";
import { FaBusinessTime } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";

export default function LabStatus() {

  const [roomData, setRoomData] = useState({
    roomId: "9226",
    tables: [

      { id: 1, name: 1, x: 16, y: 90 },
      { id: 2, name: 2, x: 63, y: 90 },
      { id: 3, name: 3, x: 143, y: 90 },
      { id: 4, name: 4, x: 190, y: 90 },
      { id: 5, name: 5, x: 273, y: 90 },
      { id: 6, name: 6, x: 319, y: 90 },
      
      { id: 7, name: 7, x: 615, y: 90 },
      { id: 8, name: 8, x: 660, y: 90 },
      { id: 9, name: 9, x: 725, y: 90 },
      { id: 10, name: 10, x: 770, y: 90 },
      { id: 11, name: 11, x: 835, y: 90 },
      { id: 12, name: 12, x: 880, y: 90 },
      { id: 13, name: 13, x: 925, y: 90 },
      { id: 14, name: 14, x: 970, y: 90 },

      { id: 15, name: 15, x: 16, y: 160 },
      { id: 16, name: 16, x: 63, y: 160 },
      { id: 17, name: 17, x: 143, y: 160 },
      { id: 18, name: 18, x: 190, y: 160 },
      { id: 19, name: 19, x: 273, y: 160 },
      { id: 20, name: 20, x: 319, y: 160 },
      { id: 21, name: 21, x: 390, y: 160 },
      { id: 22, name: 22, x: 460, y: 160 },
      { id: 23, name: 23, x: 505, y: 160 },
      { id: 24, name: 24, x: 550, y: 160 },
      { id: 25, name: 25, x: 615, y: 160 },
      { id: 26, name: 26, x: 660, y: 160 },
      { id: 27, name: 27, x: 725, y: 160 },
      { id: 28, name: 28, x: 770, y: 160 },
      { id: 29, name: 29, x: 835, y: 160 },
      { id: 30, name: 30, x: 880, y: 160 },
      { id: 31, name: 31, x: 925, y: 160 },
      { id: 32, name: 32, x: 970, y: 160 },

      { id: 33, name: 33, x: 16, y: 230 },
      { id: 34, name: 34, x: 63, y: 230 },
      { id: 35, name: 35, x: 143, y: 230 },
      { id: 36, name: 36, x: 190, y: 230 },
      { id: 37, name: 37, x: 273, y: 230 },
      { id: 38, name: 38, x: 319, y: 230 },
      { id: 39, name: 39, x: 390, y: 230 },
      { id: 40, name: 40, x: 460, y: 230 },
      { id: 41, name: 41, x: 505, y: 230 },
      { id: 42, name: 42, x: 550, y: 230 },
      { id: 43, name: 43, x: 615, y: 230 },
      { id: 44, name: 44, x: 660, y: 230 },
      { id: 45, name: 45, x: 725, y: 230 },
      { id: 46, name: 46, x: 770, y: 230 },
      { id: 47, name: 47, x: 835, y: 230 },
      { id: 48, name: 48, x: 880, y: 230 },
      { id: 49, name: 49, x: 925, y: 230 },
      { id: 50, name: 50, x: 970, y: 230 },

      { id: 51, name: 51, x: 16, y: 300 },
      { id: 52, name: 52, x: 63, y: 300 },
      { id: 53, name: 53, x: 143, y: 300 },
      { id: 54, name: 54, x: 190, y: 300 },
      { id: 55, name: 55, x: 273, y: 300 },
      { id: 56, name: 56, x: 319, y: 300 },
      { id: 57, name: 57, x: 390, y: 300 },

      { id: 58, name: 58, x: 505, y: 300 },
      { id: 59, name: 59, x: 550, y: 300 },
      { id: 60, name: 60, x: 615, y: 300 },
      { id: 61, name: 61, x: 660, y: 300 },
      { id: 62, name: 62, x: 725, y: 300 },
      { id: 63, name: 63, x: 770, y: 300 },
      { id: 64, name: 64, x: 835, y: 300 },
      { id: 65, name: 65, x: 880, y: 300 },
      { id: 66, name: 66, x: 925, y: 300 },
      { id: 67, name: 67, x: 970, y: 300 },


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
                  {q.status === "available" ? <FaBusinessTime className={`text-3xl text-white`} /> : <GiTeacher className={`text-3xl text-white`}/>}
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