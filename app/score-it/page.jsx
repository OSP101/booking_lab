"use client"
import { useState } from "react";

export default function GradingPopup() {
  const [open, setOpen] = useState(false);
  const handleSubmitGrade = () => {

    window.opener?.postMessage("grading_done_it", "*");
    window.close();
  };
  return (
    <div>
      <button onClick={handleSubmitGrade}>ให้คะแนนแล้ว</button>

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
            <button className="absolute top-2 right-2" onClick={() => setOpen(false)}>❌</button>
            <iframe src={"https://it.wwry.net/"} className="w-full h-full border-none" />
          </div>
        </div>
    </div>
  );
}
