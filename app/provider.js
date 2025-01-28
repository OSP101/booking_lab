"use client"
import React from 'react'
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react"
export default function Provider({ children, session }) {
    return (
        <SessionProvider session={session}>
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        </SessionProvider>
    )
}
