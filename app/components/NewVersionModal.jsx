'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import Link from 'next/link';
import { Prompt } from "next/font/google";

const kanit = Prompt({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const updates = [
    {
        title: "🔍 สถานะ \"กำลังตรวจ\" (สำคัญ)",
        content: <p className="mt-2 text-sm">เมื่อคุณกำลังตรวจงาน <span className="font-semibold text-blue-600">ให้กดที่คิวแล้วเปิดป๊อปอัพค้างไว้</span> เพื่ออัปเดตสถานะเป็น <span className="font-bold text-green-600">กำลังตรวจ</span> จากนั้นไอคอนที่ผังหน้าห้องจะเปลี่ยนไปโดยอัตโนมัติ</p>
    },
    {
        title: "🔗 ลิงก์ระบบลงคะแนนใหม่",
        content: <p className="mt-2 text-sm">เราได้ <span className="font-bold text-green-600">ปรับปรุงระบบลงคะแนน</span> ให้คุณสามารถ <span className="text-blue-600">เลือกหัวข้อแลป</span> ที่สร้างไว้ในระบบได้โดยตรง แทนการกรอกไอดีเอง</p>
    },
    {
        title: "⚡ โหลดเร็วขึ้น 30%",
        content: <p className="mt-2 text-sm">เว็บไซต์ได้รับการ <span className="font-bold text-green-600">ปรับปรุงประสิทธิภาพ</span> ให้ <span className="text-blue-600">โหลดเร็วขึ้น 30%</span> เพื่อประสบการณ์การใช้งานที่ดียิ่งขึ้น</p>
    },
    {
        title: "📢 ช่องทางแจ้งปัญหา & เสนอฟีเจอร์ใหม่",
        content: <p className="mt-2 text-sm">เรามี <span className="font-bold text-red-600">ช่องทางใหม่</span> สำหรับแจ้งปัญหาและเสนอฟีเจอร์เพิ่มเติม หากคุณพบปัญหาในการใช้งาน หรือมีไอเดียใหม่ ๆ <span className="text-blue-600">แจ้งเราได้เลย</span> 👉 <Link href="https://bookinglab.featurebase.app/en" target="_blank" className="text-sky-700 underline">คลิกที่นี่</Link></p>
    }
];

export default function NewVersionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const hasSeenModal = localStorage.getItem('new_version_modal');
        if (!hasSeenModal) {
            setIsOpen(true);
        }
    }, []);

    const handleNext = () => {
        if (selectedIndex < updates.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleClose = () => {
        localStorage.setItem('new_version_modal', 'true');
        setIsOpen(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" className={`${kanit.className}`} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                <ModalHeader className="text-xl font-bold">🎉 Version 1.0.1 อัปเดตใหม่มาแล้ว! 🎉</ModalHeader>
                <ModalBody>
                    <ul className="space-y-2">
                        {updates.map((update, index) => (
                            <li key={index} className="p-2 rounded-md" style={{ backgroundColor: selectedIndex >= index ? '#f3f4f6' : 'transparent' }}>
                                <strong>{update.title}</strong>
                                {selectedIndex === index && update.content}
                            </li>
                        ))}
                    </ul>
                </ModalBody>
                <ModalFooter>
                    {selectedIndex > 0 && (
                        <Button color="secondary" onPress={handlePrev}>ย้อนกลับ</Button>
                    )}
                    <Button color="primary" onPress={handleNext}>
                        {selectedIndex < updates.length - 1 ? "ถัดไป" : "รับทราบ"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
