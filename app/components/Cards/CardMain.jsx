import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { GoPlus } from "react-icons/go";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useSession } from 'next-auth/react'
import imagemind1 from '../../../public/mind-4eve-8.jpg'
import imagemind2 from '../../../public/mind-4eve-5.jpg'
import imagemind3 from '../../../public/mind-4eve-6.jpg'
import imagemind4 from '../../../public/mind-4eve-7.jpg'
import Link from 'next/link';
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function CardMain() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [dataSubject, setDataSubject] = useState([]);
    const { data: session, status } = useSession()

    const [valueName, setValueName] = React.useState("");
    const [valueYear, setValueYear] = React.useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [submitFormLoading, setSubmitFormLoading] = useState(false);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidID, setIsInvalidID] = useState(false);

    const [value, setValue] = useState("");

    const handleSelectionChange = (e) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (session.user) {
            getDataSubject();
        }
    }, [])

    const submitForm = async () => {
        setSubmitFormLoading(true);
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
            });

            const dataForm = {
                id: valueName,
                name: valueYear,
                userid: session.user.id,
                sst: value == "" ? null : value
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataForm), // แปลงเป็น JSON String
            });

            if (response.ok) {
                cancelForm();
                onOpenChange(false);
                getDataSubject();
            } else {
                console.error(`Failed to create year: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const cancelForm = () => {
        onClose();
        setValueName("");
        setValueYear("");
        setValue("");
    }

    const onInputChangeID = (e) => {
        setValueName(e);
        checkID(e);
        // console.log(e);
    }

    const onInputChangeName = (e) => {
        setValueYear(e);
    }

    const checkID = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/${id}/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS,
                }
            });
            const dataCheck = await response.json();
            if (dataCheck.status === true) {
                setIsInvalidID(true);
            } else {
                setIsInvalidID(false);
            }
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    }



    const getDataSubject = async () => {
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/${session.user.id}`, {
                method: 'GET',
                headers: headers
            });

            if (response.ok) {
                const subject = await response.json();
                setDataSubject(subject);
                setIsLoading(false);
            } else {
                console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (isLoading) {
        loadingStart();
    }

    if (!isLoading) {
        return (
            <>
                <div className={`${kanit.className} grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4`}>
                    {Array.isArray(dataSubject) && dataSubject.length > 0 ? (
                        <>
                            {dataSubject.map((sub, index) => (
                                <Link key={index} className="max-w-sm bg-white rounded-lg shadow-lg" href={`/b/${sub.id}`}>
                                    <div className="relative">
                                        <Image
                                            src={index == 0 ? imagemind1 : index == 1 ? imagemind2 : index == 2 ? imagemind3 : imagemind4}
                                            alt="Card image"
                                            className="rounded-t-lg h-40"
                                            sizes="100vw"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            loading='lazy'
                                            placeholder="blur"
                                        />
                                        <h2 className={`${kanit.className} absolute bottom-0 left-0 right-0 p-4 text-white text-xl font-bold bg-gradient-to-t from-black/60 to-transparent`}>
                                            {sub.id}
                                        </h2>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-gray-600 mb-2">{sub.name}</p>
                                    </div>
                                </Link>
                            ))}
                            {(session.user.role === "admin" || session.user.role === "teacher") && (
                                <button onClick={onOpen} className="flex items-center justify-center rounded-lg shadow-lg bg-gray-100 w-full h-12">
                                    <GoPlus className="text-4xl" />
                                </button>
                            )}
                        </>
                    ) : (

                        (session.user.role === "admin" || session.user.role === "teacher") ? (
                            <div className="flex items-center justify-center col-span-full">
                                <button onClick={onOpen} className="flex items-center justify-center rounded-lg shadow-lg bg-gray-100 w-48 h-12">
                                    <GoPlus className="text-4xl" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center col-span-full">
                                <p className="text-gray-600">No subject</p>
                            </div>
                        )
                    )}
                </div>


                <Modal isOpen={isOpen} onOpenChange={onOpenChange} className={kanit.className}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Create subject</ModalHeader>
                                <ModalBody>
                                    <Input isRequired isInvalid={isInvalidID} errorMessage="The subjectID already exists." isClearable label="Subject ID" placeholder="Enter your subject ID" type="text" value={valueName} onValueChange={onInputChangeID} />
                                    <Textarea isRequired isInvalid={isInvalidName} errorMessage="Subject names should be no more than 255 characters long." description="Course names should be no more than 255 characters long." isClearable label="Subject name" placeholder="Enter your subject name" value={valueYear} onValueChange={onInputChangeName} />
                                    <Select className={kanit.className} label="Scoring system" placeholder="Select website" size='sm' selectedKeys={[value]} onChange={handleSelectionChange}>
                                        <SelectItem key={'1'} textValue="IT WWRY">
                                            IT WWRY
                                            <p className='text-xs text-gray-400'>Scoring system of https://it.wwry.net</p>
                                        </SelectItem>
                                        <SelectItem key={'2'} textValue="Scoring Classroom">
                                            Scoring Classroom
                                            <p className='text-xs text-gray-400'>Scoring system of https://sc.osp101.dev</p>
                                        </SelectItem>
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={cancelForm}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={submitForm} isLoading={submitFormLoading}>
                                        Create
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        )
    }
}


function loadingStart() {
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
                className=" inline-flex md:ml-1 font-medium bg-clip-text text-transparent bg-[linear-gradient(90deg,#D6009A,#8a56cc,#D6009A)] dark:bg-[linear-gradient(90deg,#FFEBF9,#8a56cc,#FFEBF9)] animate-text-gradient"
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