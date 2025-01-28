"use client";
import React from "react";
import Image from "next/image";
import { Prompt } from "next/font/google";
import Link from "next/link";
import { Button } from "@heroui/react";
import Head from "next/head";

const kanit = Prompt({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function NotFound() {
    return (
        <>
            <Head>
                <title>404 Page Not Found | CP EXAM</title>
                <meta
                    name="description"
                    content="Sorry, the page you are looking for does not exist."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div
                className={`flex items-center justify-center min-h-screen bg-gray-100 px-4 ${kanit.className}`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Section: Image */}
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

                    {/* Section: Text */}
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
        </>
    );
}
