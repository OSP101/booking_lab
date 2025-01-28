'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { Input, Button, InputOtp } from "@heroui/react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import io from "socket.io-client";
import { FcOk, FcCollaboration } from "react-icons/fc";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

import PreventClose from '../components/PreventClose';

export default function Join() {
    const [bookingPin, setBookingPin] = useState('')
    const [studentId, setStudentId] = useState('')
    const [tableId, setTableId] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [dataBooking, setDataBooking] = useState();
    const [countQueue, setCountQueue] = useState();
    const [timeQueue, setTimeQueue] = useState();
    const [queue, setQueue] = useState([])
    const [socket, setSocket] = useState(undefined)

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_API_SOCKET}`);

        socket.on("connect", () => {
        });

        socket.on("queueGetData", (data) => {
            if (tableId && data.data == dataBooking.id) {
                getQueue(data);
            }

        })

        socket.on("checkQ", (data) => {
            if (tableId && data.data == dataBooking.id) {
                getQueue(data);
            }
        })

        setSocket(socket);

        return () => {
            socket.disconnect(); // อย่าลืม disconnect เมื่อ component ถูกทำลาย
        }
    }, [tableId,dataBooking])

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = {
                bookingPin,
                studentId,
                tableId
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.status == 400) {
                setErrorText(result.message);
                setOpenError(true);
                setIsLoading(false)
            }
            if (response.status == 200) {
                setDataBooking(result.bookingDetail);
                getQueue({data:result.bookingDetail.id})
                setTimeQueue(result.create_at);
                setIsLoading(false)
                setOpen(true);
                socket.emit('bookingEnllo', { data: result.bookingDetail, tableId });
            }

        } catch (error) {
            console.error('Unexpected error during login:', error)
        }
    }

    const formatDateThai = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        return new Intl.DateTimeFormat('th-TH', options).format(date);
    };

    const getQueue = async (labId) => {
        console.log("Lab Id: " + labId);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/queue/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
                body: JSON.stringify({ labId: labId.data }),
            });
            const data = await response.json();
            if (response.ok) {
                setQueue(data.queue || []);
                const position = data.queue.findIndex(item => item.table_id.toString() == tableId);
                const remainingQueue = position !== -1 ? position : 'Not';
                setCountQueue(remainingQueue);

            } else {
                console.error("Failed to fetch queue data.");
            }
        } catch (error) {
            console.error('Error fetching queue data:', error);
            setQueue([]);
        }
    };

    if (open) {
        return (
            <div className={`flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 ${kanit.className}`}>
                <div className="bg-white rounded-xl shadow-lg max-w-sm md:max-w-md">
                    <div className="p-8 space-y-6">
                        <h3 className="text-center text-3xl mb-3 font-bold text-blue-600">Booking Lab</h3>

                        {countQueue == 'Not' ? (
                            <div className='mx-auto'>
                                <p className="text-center text-sm">You have been checked.</p>
                                <h3 className="text-center text-3xl mb-3 font-bold mx-auto"><FcOk className='mx-auto text-3xl'/></h3>
                            </div>
                        ) : countQueue == 0 ? (
                            <div>
                                <p className="text-center text-sm">It's your turn to get checked.</p>
                                <h3 className="text-center text-3xl mb-3 font-bold"><FcCollaboration className='mx-auto text-3xl'/></h3>
                            </div>
                        ): (
                            <div>
                                <p className="text-center text-sm">You are in queue</p>
                                <h3 className="text-center text-3xl mb-3 font-bold">{countQueue}</h3>
                            </div>
                        )}

                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="text-xs w-1/3">Student ID:</td>
                                    <td className="text-xs font-bold w-2/3">{studentId}</td>
                                </tr>
                                <tr>
                                    <td className="text-xs w-1/3">Table ID:</td>
                                    <td className="text-xs font-bold w-2/3">{tableId}</td>
                                </tr>
                                <tr>
                                    <td className="text-xs w-1/3">Date Time:</td>
                                    <td className="text-xs font-bold w-2/3">{formatDateThai(timeQueue)}</td>
                                </tr>
                                <tr>
                                    <td className="text-xs w-1/3">Booking Name:</td>
                                    <td className="text-xs font-bold w-2/3">{dataBooking.name}</td>
                                </tr>
                                <tr>
                                    <td className="text-xs w-1/3">Subject Name:</td>
                                    <td className="text-xs font-bold w-2/3">{dataBooking.sName}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <PreventClose />
            </div>

        )
    }
    return (
        <>
            <div className={`flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 ${kanit.className}`}>
                <div className="bg-white rounded-xl shadow-lg max-w-sm md:max-w-md">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Header */}
                        <div className="text-center pb-2">
                            <h3 className="text-3xl mb-3 font-bold text-blue-600">Booking Lab</h3>
                        </div>

                        {/* bookingPin Input */}

                        <div className='mb-3'>
                            <p className='text-sm'>Booking ID</p>
                            <InputOtp length={6} value={bookingPin} onValueChange={setBookingPin} radius='md' label="Booking ID" className='pb-4' isRequired />
                        </div>

                        {/* studentId Input */}
                        <div>
                            <Input
                                type={"text"}
                                value={studentId}
                                label="Student ID"
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                size="md"
                                labelPlacement="outside"
                                placeholder="Enter your Student ID"
                                className="rounded-md pb-5"
                            />
                        </div>

                        {/* tableId Input */}
                        <div>
                            <Input
                                type={"number"}
                                value={tableId}
                                label="Table ID"
                                onChange={(e) => setTableId(e.target.value)}
                                required
                                size="md"
                                labelPlacement="outside"
                                placeholder="Enter your Table ID"
                                className="rounded-md"
                            />
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Booking!
                        </Button>
                    </form>
                </div>
            </div>

            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>Booking fail!</AlertTitle>
                    {errorText}
                </Alert>
            </Snackbar>
        </>
    )
}
