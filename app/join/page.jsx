'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { Input, Button, InputOtp, RadioGroup, Radio } from "@heroui/react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import io from "socket.io-client";
import { FcOk, FcCollaboration } from "react-icons/fc";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation'
import PreventClose from '../components/PreventClose';

import Link from 'next/link';

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
    const [selected, setSelected] = useState("in-progress");

    const searchParams = useSearchParams()
 
    const pin = searchParams.get('booking-pin')

    useEffect(() => {
        if (pin) {
            setBookingPin(pin)
        }
    },[])

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_API_SOCKET}`);

        socket.on("connect", () => { });

        socket.on("queueGetData", (data) => {
            if (tableId && data.data == dataBooking.id) {
                getQueue(data);
            }
        });

        socket.on("checkQ", (data) => {
            if (tableId && data.data == dataBooking.id) {
                getQueue(data);
            }
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, [tableId, dataBooking]);

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                bookingPin,
                studentId,
                tableId,
                status: selected
            };

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
                setIsLoading(false);
            }
            if (response.status == 200) {
                setDataBooking(result.bookingDetail);
                getQueue({ data: result.bookingDetail.id });
                setTimeQueue(result.create_at);
                setIsLoading(false);
                setOpen(true);
                socket.emit('bookingEnllo', { data: result.bookingDetail, tableId });
            }
        } catch (error) {
            console.error('Unexpected error during login:', error);
        }
    };

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
            <div className={`flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-400 ${kanit.className}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}

                >
                    <div className="bg-white rounded-xl shadow-lg max-w-sm md:max-w-md transform transition-all duration-300 hover:scale-105">
                        <div className="p-8 space-y-6">
                            <h3 className="text-center text-3xl mb-3 font-bold text-blue-600">Booking Lab</h3>

                            {countQueue == 'Not' ? (
                                <div className='mx-auto'>
                                    <p className="text-center text-sm">You have been checked.</p>
                                    <h3 className="text-center text-3xl mb-3 font-bold mx-auto"><FcOk className='mx-auto text-3xl' /></h3>
                                </div>
                            ) : countQueue == 0 ? (
                                <div>
                                    <p className="text-center text-sm">It's your turn to get checked.</p>
                                    <h3 className="text-center text-3xl mb-3 font-bold"><FcCollaboration className='mx-auto text-3xl' /></h3>
                                </div>
                            ) : (
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

                    <div className="text-center mt-4">
                                <Link
                                    href="https://bookinglab.featurebase.app/"
                                    target='_blank'
                                    className="text-md text-white transition duration-300"
                                >
                                    Feedback and Roadmap
                                </Link>
                            </div>
                    <footer className="mt-4 text-center text-sm text-white">
                        <p className="flex items-center justify-center gap-2 text-xs">
                            © 2024 Booking Lab v1.0.5
                            <span className="w-1 h-1 bg-white rounded-full" />
                            All Rights Reserved
                        </p>
                        <p className="mt-2 text-xs">
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
                </motion.div>
                <PreventClose />
            </div>
        );
    }

    return (
        <>
            {/* <TourGuide /> */}

            <div className={`flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-400 ${kanit.className}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}

                >
                    <div className="bg-white rounded-xl shadow-lg max-w-sm md:max-w-md transform transition-all duration-300 hover:scale-105">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6" id="bookingForm">
                            {/* Header */}
                            <div className="text-center pb-2">
                                <h3 className="text-3xl mb-3 font-bold text-blue-600">Booking Lab</h3>
                            </div>

                            {/* bookingPin Input */}
                            <div className={`pb-4 ${kanit.className}`}>
                                <p className='text-sm'>Booking ID</p>
                                <InputOtp id="bookingId" length={6} value={bookingPin} onValueChange={setBookingPin} radius='md' label="Booking ID" className='booking-input' isRequired />
                            </div>

                            {/* studentId Input */}
                            <div className={`mb-3 ${kanit.className}`}>
                                <Input
                                    id="studentId"
                                    isRequired
                                    type={"text"}
                                    value={studentId}
                                    label="Student ID"
                                    onChange={(e) => setStudentId(e.target.value)}
                                    required
                                    size="md"
                                    labelPlacement="outside"
                                    placeholder="Enter your Student ID"
                                    className="rounded-md pb-5 student-id-input"
                                />
                            </div>

                            {/* tableId Input */}
                            <div className="">
                                <Input
                                    id="tableId"
                                    isRequired
                                    type={"number"}
                                    value={tableId}
                                    label="Table ID"
                                    onChange={(e) => setTableId(e.target.value)}
                                    required
                                    size="md"
                                    labelPlacement="outside"
                                    placeholder="Enter your Table ID"
                                    className="rounded-md table-id-input"
                                />
                            </div>

                            {/* Radio Group */}
                            <div className="radio-group">
                                <RadioGroup id='Radio' orientation="horizontal" value={selected} onValueChange={setSelected} isRequired className='text-sm text-black'>
                                    <Radio value="in-progress">Check work</Radio>
                                    <Radio value="issue">Issue</Radio>
                                </RadioGroup>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                id='submitButton'
                                className="submit-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300 transform hover:scale-105"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Booking!
                            </Button>
                        </form>
                    </div>
                    <div className="text-center mt-4">
                                <Link
                                    href="https://bookinglab.featurebase.app/"
                                    target='_blank'
                                    className="text-md text-white transition duration-300"
                                >
                                    Feedback and Roadmap
                                </Link>
                            </div>
                    <footer className="mt-4 text-center text-sm text-white">
                        <p className="flex items-center justify-center gap-2 text-xs">
                            © 2024 Booking Lab v{process.env.NEXT_PUBLIC_VERSION}
                            <span className="w-1 h-1 bg-white rounded-full" />
                            All Rights Reserved
                        </p>
                        <p className="mt-2 text-xs">
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
                </motion.div>
            </div>

            {/* Error Snackbar */}
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
    );
}