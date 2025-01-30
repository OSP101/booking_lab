"use client"
import React, { useState, useEffect, use } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Tooltip, Chip, Switch, cn, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, } from "@heroui/react";
import { FaBusinessTime } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import io from "socket.io-client";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function Booking(props) {
    const { data: session, status } = useSession()
    const params = use(props.params)
    const slug = params.slug;
    const id = params.id;

    const [bookingData, setBookingData] = useState({});
    const [roomData, setRoomData] = useState([]);
    const [roomDataChach, setRoomDataChach] = useState([]);
    const [isNotFound, setIsNotFound] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const [timeDate, setTimeDate] = useState("");
    const [queue, setQueue] = useState([])
    const [socket, setSocket] = useState(undefined)
    const { isOpen, onOpen, onOpenChange, onClose: onCloseDelete } = useDisclosure();
    const { isOpen:isOpenIssue, onOpen:onOpenIssue, onOpenChange:onOpenChangeIssue, onClose: onCloseDeleteIssue } = useDisclosure();

    const [openError, setOpenError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    const [stdidDelete, setStdidDelete] = useState('');

    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    const openModalDelete = (data,Qdata) => {
        setStdidDelete(data)
        if(Qdata == "in-progress"){
           onOpen() 
        }else{
            onOpenIssue()
        }
        
    }

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    const switchState = async (e) => {
        console.log("Switch:" + e);

        const dataStatus = e ? "active" : "inactive";
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/booking/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
                body: JSON.stringify({ status: dataStatus }),
            });
            const data = await response.json();
            if (response.ok) {
                setIsSelected(e);
                setBookingData(data.bookingDetail);
            } else {
                console.error("Failed to fetch queue data.");
            }
        } catch (error) {
            console.error('Error fetching queue data:', error);
        }
    }

    const checkUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
                body: JSON.stringify({ userid: session.user.id }),
            });
            const dataCheck = await response.json();
            if (dataCheck.length === 0) {
                setIsNotFound(2);
            } else {
                setIsNotFound(1);
                getData();
                getRoom()
            }
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    }

    const getQueue = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/queue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
                body: JSON.stringify({ labId: slug }),
            });
            const data = await response.json();
            if (response.ok) {
                setQueue(data.queue || []);
            } else {
                console.error("Failed to fetch queue data.");
            }
        } catch (error) {
            console.error('Error fetching queue data:', error);
            setQueue([]);
        }
    };

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/booking/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setBookingData(data.bookingDetail);
                setIsSelected(data.bookingDetail?.status === "active");
            } else {
                console.error("Failed to fetch booking data.");
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    const getRoom = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/room/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRoomData(data.roomDetail || []);
                setRoomDataChach(data.roomDetail)
                setLoadingData(true);
            } else {
                console.error("Failed to fetch booking data.");
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    const updateTableStatus = (data) => {
        const updatedTables = data.map((table) => {
            const queueItem = queue.find((q) => q.table_id === table.table_id);
            return queueItem
                ? { ...table, status: queueItem.status, studentId: queueItem.studentId }
                : { ...table, status: "done", studentId: "" };
        });

        setRoomData(updatedTables);
    };

    const getCurrentTime = () => {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        setTimeDate(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`)
    };

    setInterval(() => {
        getCurrentTime();
    }, 1000);

    useEffect(() => {
        if (slug && session) {
            checkUser()
            getCurrentTime()
            getQueue()
        }
    }, [session]);

    useEffect(() => {
        if (roomData.length > 0 && queue.length > 0) {
            updateTableStatus(roomData);
        }
    }, [queue, roomDataChach]);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_API_SOCKET}`);

        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("queueGetData", (data) => {
            getQueue();
        })

        socket.on("checkQ", (data) => {
            getQueue();
        })

        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, [])

    const formatDateThai = (dateString) => {
        const date = new Date(dateString);
        const yearBuddhist = date.getFullYear() + 543;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${yearBuddhist} ${hours}:${minutes}:${seconds}`;
    };

    const handleConfirmQueue = async () => {
        if(bookingData.redirect !== null){
        const gradingUrl = `https://sc.osp101.dev/booking-lab/${id}/${bookingData.redirect}/${stdidDelete}/${session?.user?.name}`;
        const newTab = window.open(gradingUrl, "_blank");
      
        window.addEventListener("message", async (event) => {
          if (event.data === "grading_done") {
            newTab?.close();
      
            await updateStatus("available");
          }
        });
    }else{
        updateStatus("available");
    }
      };
      

    const updateStatus = async (status) => {
        status == "done" ? setIsLoading(true) : setIsLoadingDelete(true)
        try {
            const dataForm = {
                userId: session.user.id,
                labId: slug,
                studentId: stdidDelete,
                status: status
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/queue`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                },
                body: JSON.stringify(dataForm)
            });
            if (response.ok) {
                getQueue();
                setOpenError(true)
                setIsLoading(false)
                setIsLoadingDelete(false)
                onCloseDelete();
                socket.emit("checkQ", slug)
            } else {
                console.error("Failed to fetch booking data.");
                setIsLoading(false)
                setIsLoadingDelete(false)
                onCloseDelete();
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    if (isNotFound == 1 && loadingData) {
        return (
            <div className={`h-screen flex bg-gray-100 items-end justify-center ${kanit.className}`}>
                <div className="w-[98%] h-screen mx-auto">
                    {windowWidth >= 768 && (
                        <div className="bg-white h-[15%] p-6 rounded-xl shadow-md flex w-[40%] mb-2 mx-auto">
                            <div className="flex justify-center items-center w-full">
                                <div className="w-1/2">
                                    <p className="text-end text-lg">Join at <span className="font-bold">10.199.7.28/join</span></p>
                                    <p className="text-end text-md">{timeDate}</p>
                                </div>
                                <Divider orientation="vertical" className="mx-2 font-bold" />
                                <div className="w-1/2">
                                    <p className="text-xs font-bold">Booking PIN:</p>
                                    <p className="text-5xl font-black">{bookingData.pin || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white h-[83%] p-6 rounded-xl shadow-md flex w-[98%] mx-auto">
                        {/* Left Panel: Tables */}
                        {windowWidth >= 768 && ( // ตรวจสอบขนาดหน้าจอ
                            <div className="w-3/4 p-4 relative">
                                <div className="bg-cyan-500 text-white text-center py-2 rounded">
                                    <h2 className="text-lg font-bold">Screen</h2>
                                </div>

                                <div className="grid grid-cols-12 gap-2 mt-4">
                                    {roomData.map((table, index) => (
                                        <div
                                            key={table.id || `room-${index}`}
                                            onClick={() => table.status === "in-progress" && openModalDelete(table.studentId)}
                                            className={`absolute flex items-center justify-center w-11 h-11 border rounded-lg 
                                            ${table.status === "available"
                                                    ? "bg-green-200"
                                                    : table.status === "in-progress"
                                                        ? "bg-yellow-200"
                                                        : table.status === "done"
                                                            ? "bg-gray-400"
                                                            : table.status === "issue" ? "bg-red-400" : "bg-gray-400"
                                                }`}
                                            style={{
                                                left: `${table.x}px`,
                                                top: `${table.y}px`,
                                            }}
                                        >
                                            <p>{table.name}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}
                        {/* Right Panel: Details */}
                        <div className={`${windowWidth >= 768 ? "w-1/4 " : "w-4/4"}pl-6 h-[100%]`}>
                            <div className="bg-white p-4 rounded-xl shadow-md h-full">
                                {/* Lab Information */}
                                <div>
                                    <User
                                        avatarProps={{ radius: "lg", src: bookingData.image }}
                                        description={bookingData.sName}
                                        name={bookingData.name}
                                    >
                                        {bookingData.name}
                                    </User>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-sm text-gray-600">Date:</p>
                                        <p className="text-sm font-medium">{new Date(bookingData.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <p className="text-sm text-gray-600">Room:</p>
                                        <p className="text-sm font-medium">{bookingData.room}</p>
                                    </div>
                                    {(session.user.role == "admin" || session.user.role == "teacher") && (
                                        <Switch
                                            isSelected={isSelected}
                                            onValueChange={(e) => switchState(e)}
                                            classNames={{
                                                base: cn(
                                                    "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                                                    "justify-between cursor-pointer rounded-lg gap-2 p-2 mt-2 border-2 border-transparent",
                                                    "data-[selected=true]:border-primary"
                                                ),
                                                wrapper: "p-0 h-4 overflow-visible",
                                                thumb: cn(
                                                    "w-6 h-6 border-2 shadow-lg",
                                                    "group-data-[hover=true]:border-primary",
                                                    //selected
                                                    "group-data-[selected=true]:ms-6",
                                                    // pressed
                                                    "group-data-[pressed=true]:w-7",
                                                    "group-data-[selected]:group-data-[pressed]:ms-4"
                                                ),
                                            }}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <p className="text-medium">{isSelected ? "Active" : "Inactive"}</p>
                                                <p className="text-tiny text-default-400">
                                                    {isSelected ? "Booking is now open." : "Booking is now closed."}
                                                </p>
                                            </div>
                                        </Switch>
                                    )}
                                </div>

                                {/* Queue List */}
                                <div className="mt-5">
                                    <h3 className="font-bold text-lg">Queue</h3>
                                    <div className="mt-4 overflow-y-auto max-h-80">
                                        {queue.map((q, index) => (
                                            (q.status == "in-progress" || q.status == "issue") &&
                                            <div
                                                key={q.table_id || `queue-${index}`}
                                                className={`flex justify-between items-center p-2 mb-2 rounded-lg shadow ${q.status === "in-progress" ? "bg-yellow-200" : q.status == "issue" ? "bg-red-200" : "bg-yellow-200"
                                                    }`}
                                                onClick={() => openModalDelete(q.studentId, q.status)}
                                            >
                                                <div className="flex items-center">
                                                    <span
                                                        className={`font-bold w-10 text-center ${q.status === "in-progress" ? "text-yellow-600" : q.status == "issue" ? "bg-red-600" : "bg-yellow-600"
                                                            }`}
                                                    >
                                                        {q.table_id}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm">{q.studentId}</p>
                                                        <p className="text-xs text-gray-600 font-sans">{formatDateThai(q.time)}</p>
                                                    </div>
                                                </div>
                                                {q.status === "available" ? (
                                                    <FaBusinessTime className={`text-3xl text-white`} />
                                                ) : (
                                                    <GiTeacher className={`text-3xl text-white`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onCloseDelete) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Delete queue</ModalHeader>
                                <ModalBody>
                                    <p>
                                        Are you really going to delete queue {stdidDelete} ?
                                    </p>
                                </ModalBody>
                                <ModalFooter className="flex justify-between">
                                    <Button color="primary" onPress={() => updateStatus("done")} isLoading={isLoading}>
                                        Delete
                                    </Button>
                                    <div>
                                        <Button color="danger" variant="light" onPress={onCloseDelete}>
                                            Close
                                        </Button>
                                        <Button color="success" onPress={() => handleConfirmQueue()} isLoading={isLoadingDelete}>
                                            Succeed
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpenIssue} onOpenChange={onOpenChangeIssue}>
                    <ModalContent>
                        {(onCloseDeleteIssue) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Delete queue</ModalHeader>
                                <ModalBody>
                                    <p>
                                        Are you really going to delete queue {stdidDelete} ?
                                    </p>
                                </ModalBody>
                                <ModalFooter className="flex justify-between">
                                    <Button color="primary" onPress={() => updateStatus("done")} isLoading={isLoading}>
                                        Delete
                                    </Button>
                                    <div>
                                        <Button color="danger" variant="light" onPress={onCloseDeleteIssue}>
                                            Close
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert
                        onClose={handleCloseError}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        <AlertTitle>Delete queue success</AlertTitle>
                        {errorText}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
    return (
        <div>
            <LoadingStart />
        </div>
    )
}

function LoadingStart() {
    <style jsx>{`
      @keyframes text-gradient {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
    
      .animate-text-gradient {
        animation: text-gradient 3s linear infinite;
      }
    `}</style>
    return (
        <div>
            <p
                className={`inline-flex md:ml-1 font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,#D6009A,#8a56cc,#D6009A)] dark:bg-[linear-gradient(90deg,#FFEBF9,#8a56cc,#FFEBF9)] animate-text-gradient ${kanit.className}`}
                style={{
                    fontSize: "2rem",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                }}
            >
                Loading...
            </p>
        </div>
    )
}