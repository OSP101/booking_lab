'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input, Button, Divider } from "@heroui/react";
import { EyeSlashFilledIcon } from '../components/EyeSlashFilledIcon ';
import { EyeFilledIcon } from '../components/EyeFilledIcon ';
import Link from "next/link";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import { useSession } from 'next-auth/react'
import { TbMail } from "react-icons/tb";
import { LuLockKeyhole } from "react-icons/lu";
import gsap from "gsap";


const GSAPButton = React.forwardRef((props, ref) => (
    <Button {...props} ref={ref} />
));

export default function Login() {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    )
}

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const statusLogin = searchParams.get('status')
    const loginBoxRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    useEffect(() => {
        if (statusLogin) {
            setOpen(true)
        }
    }, [statusLogin])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const result = await signIn('credentials', {
                email,
                password,
                callbackUrl: '/'
            })

            if (result?.error) {
                setOpen(true)
                console.error('Login failed:', result.error)
            }
        } catch (error) {
            console.error('Unexpected error during login:', error)
            setOpen(true)
        }
    }

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <>
            <GSAPBackground />

            <div className="flex h-screen items-center justify-center relative z-10">
                <div className="w-full max-w-md" ref={loginBoxRef}>
                    <div ref={loginBoxRef} className="bg-white rounded-xl shadow-lg w-full max-w-sm md:max-w-md">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Header */}
                            <div className="text-center pb-2">
                                <h3 className="text-xl font-bold text-blue-600">Welcome to Booking Lab</h3>
                                <p className="text-sm text-gray-500">Log in to continue to Web Application.</p>
                            </div>

                            {/* Email Input */}
                            <div>
                                <Input
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    size="md"
                                    labelPlacement="outside"
                                    placeholder="Enter your email"
                                    className="rounded-md"
                                    startContent={<TbMail className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />}
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <Input
                                    id="password"
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    label="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    size="md"
                                    labelPlacement="outside"
                                    placeholder="Enter your password"
                                    className="rounded-md"
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

                            {/* Sign In Button */}
                            <GSAPButton
                                ref={buttonRef}
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300"
                                size="md"
                                isLoading={isLoading}
                            >
                                Sign In
                            </GSAPButton>

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <Link href="/recovery" className="text-sm text-blue-500 hover:text-blue-700 transition duration-300">
                                Forgot password
                                </Link>
                            </div>
                        </form>
                    </div>

                    <footer className="mt-8 text-center text-sm text-white">
                        <p className="flex items-center justify-center gap-2">
                            © 2024 Booking Lab v{process.env.NEXT_PUBLIC_VERSION}
                            <span className="w-1 h-1 bg-white rounded-full" />
                            All Rights Reserved
                        </p>
                        <p className="mt-2">
                            Made with ❤️ by{' '}
                            <Link href="https://github.com/saitoarm" target="_blank" className="hover:text-sky-700">
                                SaitoArm
                            </Link>
                            {' & '}
                            <Link href="https://github.com/OSP101" target="_blank" className="hover:text-sky-700">
                                OSP101
                            </Link>
                        </p>
                    </footer>

                    <GSAPButton
                        ref={buttonRef}
                        type="button"
                        className="w-full text-white hover:text-black font-medium rounded-md transition duration-300 mt-4"
                        size="md"
                        variant="ghost"
                    >
                        <Link href="/join">
                            คุณเป็นนักศึกษาใช่ไหม? คุณต้องคลิกที่นี่
                        </Link>
                    </GSAPButton>

                </div>
            </div>



            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                    <AlertTitle>Login fail!</AlertTitle>
                    <p>Email or password is not correct.</p>
                </Alert>
            </Snackbar>
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
