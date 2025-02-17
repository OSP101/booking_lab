'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Input, Button, Divider, Alert, Spinner } from "@heroui/react";
import gsap from "gsap";
import { EyeSlashFilledIcon } from '../components/EyeSlashFilledIcon ';
import { EyeFilledIcon } from '../components/EyeFilledIcon ';
import { LuLockKeyhole } from "react-icons/lu";
import Image from "next/image";
import { Prompt } from "next/font/google";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar';

const kanit = Prompt({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const GSAPButton = React.forwardRef((props, ref) => (
    <Button {...props} ref={ref} />
));

export default function ResetPassword() {
    return (
        <Suspense fallback={<LoadingStart />}>
            <ResetPasswordPage />
        </Suspense>
    )
}

function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [emailData, setEmailData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const loginBoxRef = useRef(null);
    const buttonRef = useRef(null);
    const [pageShow, setPageShow] = useState(0);
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    useEffect(() => {
        if (token) {
            console.log(token)
            checkToken(token)
        } else {
            setPageShow(1)
        }
    }, []);

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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
        router.push('/login')
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recovery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
                },
                body: JSON.stringify({ password: newPassword, email: emailData }),
            });

            const data = await response.json();
            if (response.status === 201) {
                setOpen(true)
            } else {
                console.error('Error during password reset:', data.error);
            }
        } catch (error) {
            console.error('Error during password reset:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkToken = async (token) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/token-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
            },
            body: JSON.stringify({ token: token }),
        });

        const data = await response.json();
        if (response.status === 404) {
            setPageShow(1);
        } else if (response.status === 400) {
            setPageShow(2);
        } else if (response.status === 200) {
            setEmailData(data.email);
            setPageShow(3);
        } else {
            setPageShow(0);
        }
    }
    if (pageShow === 3) {
        return (
            <>
                <GSAPBackground />
                <div className="flex h-screen items-center justify-center relative z-10">
                    <div className="w-full max-w-lg p-6">
                        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                            <div className="text-center pb-4">
                                <h3 className="text-2xl font-semibold text-blue-600">Reset Your Password</h3>
                                <Alert
                                    title="กรุณากรอกรหัสผ่านใหม่ของคุณ"
                                    hideIconWrapper
                                    hideIcon
                                    color="success"
                                    className="my-4 text-sm text-center"
                                />
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-6">

                                <div className="space-y-2">

                                    <Input
                                        label="Password"
                                        type={isVisible ? "text" : "password"}
                                        id="newPassword"
                                        size="md"
                                        labelPlacement="outside"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        isRequired
                                        startContent={<LuLockKeyhole className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                                        endContent={
                                            <button
                                                type="button"
                                                onClick={toggleVisibility}
                                                aria-label="toggle password visibility"
                                                className="focus:outline-none"
                                            >
                                                {isVisible ? <EyeSlashFilledIcon className="text-xl text-gray-400" /> : <EyeFilledIcon className="text-xl text-gray-400" />}
                                            </button>
                                        }
                                    />
                                </div>


                                <div className="space-y-3">

                                    <Input
                                        label="Confirm Password"
                                        type={isVisible ? "text" : "password"}
                                        id="confirmPassword"
                                        size="md"
                                        labelPlacement="outside"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        isRequired
                                        className='pt-3'
                                        startContent={<LuLockKeyhole className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                                        endContent={
                                            <button
                                                type="button"
                                                onClick={toggleVisibility}
                                                aria-label="toggle password visibility"
                                                className="focus:outline-none"
                                            >
                                                {isVisible ? <EyeSlashFilledIcon className="text-xl text-gray-400" /> : <EyeFilledIcon className="text-xl text-gray-400" />}
                                            </button>
                                        }
                                    />
                                    {passwordError && <p className="text-red-500 text-xs mt-2">Passwords do not match</p>}
                                </div>

                                <div className="text-center mt-6">
                                    <GSAPButton
                                        type="submit"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-3 transition duration-300"
                                        isLoading={isLoading}
                                    >
                                        Reset Password
                                    </GSAPButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    {open && <Alert color="success" description={"Password changed successfully"}/>}
                </Snackbar>
            </>

        )
    }

    if (pageShow === 1) {
        return (
            <div
                className={`flex items-center justify-center min-h-screen bg-gray-100 px-4 ${kanit.className}`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    <div className="flex justify-center lg:justify-end">
                        <Image
                            src="/404-error-page.svg"
                            alt="404 - Page Not Found"
                            width={350}
                            height={350}
                            className="max-w-full h-auto"
                            priority
                        />
                    </div>

                    <div className="text-center lg:text-left space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#0776bc] to-[#57ade2] bg-clip-text text-transparent">
                            Oops! Page not found.
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base lg:mr-56">
                            Sorry, we couldn’t find the page you were looking for. Please
                            check the URL or return to the homepage.
                        </p>
                        <div className="mt-6">
                            <Link href="/" passHref>
                                <Button
                                    className="bg-gradient-to-tr from-[#0776bc] to-[#57ade2] text-white shadow-lg"
                                    size="lg"
                                >
                                    Back to Classes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (pageShow === 2) {
        return (
            <div
                className={`flex items-center justify-center min-h-screen bg-gray-100 px-4 ${kanit.className}`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    <div className="flex justify-center lg:justify-end">
                        <Image
                            src="/empty-amico.svg"
                            alt="400 - Page Not Found"
                            width={350}
                            height={350}
                            className="max-w-full h-auto"
                            priority
                        />
                    </div>

                    <div className="text-center lg:text-left space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#0776bc] to-[#57ade2] bg-clip-text text-transparent">
                            Oops! Token expired.
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base lg:mr-56">
                            Sorry, your token has expired. Please try again.
                        </p>
                        <div className="mt-6">
                            <Link href="/recovery" passHref>
                                <Button
                                    className="bg-gradient-to-tr from-[#0776bc] to-[#57ade2] text-white shadow-lg"
                                    size="lg"
                                >
                                    Back to Recovery
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    )
}

function LoadingStart() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
        </div>
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