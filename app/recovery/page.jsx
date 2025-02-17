'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Input, Button, Divider, Alert, Spinner } from "@heroui/react";
import { TbMail } from "react-icons/tb";
import gsap from "gsap";
import { FaSearch } from "react-icons/fa";

const GSAPButton = React.forwardRef((props, ref) => (
    <Button {...props} ref={ref} />
));

export default function ResetPassword() {
    return (
        <Suspense>
            <ResetPasswordPage />
        </Suspense>
    )
}

function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userError, setUserError] = useState(false)
    const [pageReset, setPageReset] = useState(false)
    const buttonRef = useRef(null);
    const loginBoxRef = useRef(null);
    const description = "ค้นหาบัญชีผู้ใช้ของคุณด้วยอีเมลที่ทำการลงทะเบียน";

    useEffect(() => {
        // Fade in animation for login box
        if (loginBoxRef.current) {
            gsap.fromTo(
                loginBoxRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
            );
        }

        // Button hover effect
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                scale: 1.05,
                repeat: -1,
                yoyo: true,
                duration: 0.5,
                ease: "power1.inOut"
            });
        }
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''

                },
                body: JSON.stringify({ email }),
            })
            const data = await response.json()
            if (data.status === 404) {
                setUserError(true)
                setIsLoading(false)
            }
            setPageReset(true)
            setIsLoading(false)
        } catch (error) {
            console.error('Error during password reset:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (pageReset) {
        return (
            <>
                <GSAPBackground />
                <div className="flex h-screen items-center justify-center relative z-10">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm md:max-w-md">
                            <form className="p-8 space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-blue-600">Account Recovery</h3>
                                    <Alert description={email} title="บัญชีอีเมลของคุณคือ" hideIconWrapper hideIcon color='success' className='mt-3' />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-center text-gray-700">วิธีกำหนดรหัสผ่านใหม่ของคุณ</p>
                                    <p className="text-sm text-center text-gray-500">Method to set your new password</p>
                                    <Divider className="my-5" />

                                    <div className="space-y-2">
                                        <p className="text-sm text-center text-gray-600">ส่งลิงก์ไปยังอีเมลของคุณเพื่อกำหนดรหัสผ่านใหม่</p>
                                        <p className="text-sm text-center text-gray-600">Send a link to your recovery email to reset your password.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <GSAPBackground />
            <div className="flex h-screen items-center justify-center relative z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm md:max-w-md">
                        <form onSubmit={handleResetPassword} className="p-8 space-y-6">
                            <div className="text-center pb-2">
                                <h3 className="text-xl font-bold text-blue-600">Account Recovery</h3>
                                <Alert description={description} hideIconWrapper color='primary' className='my-3' />
                            </div>

                            {/* Email Input */}
                            <div>
                                <Input
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    isRequired
                                    size="md"
                                    labelPlacement="outside"
                                    placeholder="Enter your email"
                                    className="rounded-md"
                                    startContent={<TbMail className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                                />
                                
                            </div>
                            {userError && <Alert description={"ไม่พบข้อมูลบัญชีผู้ใช้ของคุณ"} hideIconWrapper color='danger' className='my-3' />}
                            <GSAPButton
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300"
                                size="md"
                                isLoading={isLoading}
                            >
                                <FaSearch />  Search
                            </GSAPButton>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

function GSAPBackground() {
    const gridRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.fromTo(
            ".grid-line",
            { scaleX: 0, opacity: 0 },
            {
                scaleX: 1,
                opacity: 0.5,
                duration: 2,
                stagger: 0.3,
                ease: "power2.inOut"
            }
        );
    }, []);

    return (
        <svg className="absolute w-full h-screen bg-black" xmlns="http://www.w3.org/2000/svg">
            {[...Array(10)].map((_, i) => (
                <line
                    key={`v-${i}`}
                    className="grid-line"
                    x1={`${i * 10}%`}
                    y1="0"
                    x2={`${i * 10}%`}
                    y2="100%"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.2"
                />
            ))}
            {[...Array(10)].map((_, i) => (
                <line
                    key={`h-${i}`}
                    className="grid-line"
                    x1="0"
                    y1={`${i * 10}%`}
                    x2="100%"
                    y2={`${i * 10}%`}
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.2"
                />
            ))}
        </svg>
    );
}