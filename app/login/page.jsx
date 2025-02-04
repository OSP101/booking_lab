'use client'

import { useState, useEffect, Suspense } from 'react'
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
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"></meta>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <title>Login | Booking Lab</title>
            </head>
            <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                <div>
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm md:max-w-md">
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
                                    startContent={
                                        <TbMail className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
                                    }
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
                                    startContent={
                                        <LuLockKeyhole className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
                                    }
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={toggleVisibility}
                                            aria-label="toggle password visibility"
                                            className="focus:outline-none"
                                        >
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-xl text-gray-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-xl text-gray-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Sign In
                            </Button>

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <a
                                    href="#"
                                    className="text-sm text-blue-500 hover:text-blue-700 transition duration-300"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        </form>
                    </div>
                    <footer className="mt-8 text-center text-sm text-white">
                        <p className="flex items-center justify-center gap-2">
                            © 2024 Booking Lab v1.0.5
                            <span className="w-1 h-1 bg-white rounded-full" />
                            All Rights Reserved
                        </p>
                        <p className="mt-2">
                            Made with ❤️ by{' '}
                            <Link href="https://github.com/saitoarm" target="_blank" className="hover:text-sky-700">
                                Saitoarm
                            </Link>
                            {' & '}
                            <Link href="https://github.com/OSP101" target="_blank" className="hover:text-sky-700">
                                OSP101
                            </Link>
                        </p>
                    </footer>
                </div>
            </div>

            <Suspense>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        <AlertTitle>Login fail!</AlertTitle>
                        <p>Email or password is not correct.</p>
                    </Alert>
                </Snackbar>
            </Suspense>
        </>
    )
}

