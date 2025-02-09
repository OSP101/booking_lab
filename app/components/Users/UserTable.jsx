'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Button, Form, Spinner, Autocomplete, AutocompleteItem, Avatar } from "@heroui/react"
import { Select, SelectItem } from "@heroui/react";
import { User, columns, renderCell } from './columns'
import { SearchIcon } from '../icons'
import { IoIosAdd } from "react-icons/io";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import { FaUserPlus } from "react-icons/fa";
import { useSession } from 'next-auth/react'
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });



export default function DataTable({ subjectId }) {
    const { data: session, status } = useSession()
    const [filterValue, setFilterValue] = useState('')
    const hasSearchFilter = Boolean(filterValue)
    const [dataUsers, setDataUsers] = useState([]);
    const [dataUserCheck, setDataUserCheck] = useState([]);
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const [createUser, setCreateUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [dataDeleteUser, setDataDeleteUser] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openSuccessEdit, setOpenSuccessEdit] = useState(false);
    const [openErrorEdit, setOpenErrorEdit] = useState(false);
    const [openSuccessDelete, setOpenSuccessDelete] = useState(false);
    const [openErrorDelete, setOpenErrorDelete] = useState(false);
    const [textError, setTextError] = useState('');
    const [password, setPassword] = React.useState("");
    const errors = [];
    const [deleteUserStatus, setDeleteUserStatus] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const handleCloseAdd = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const handleCloseAddError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const handleCloseEdit = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessEdit(false);
    };

    const handleCloseEditError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorEdit(false);
    };

    const handleCloseDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessDelete(false);
    };

    const handleCloseEditDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorDelete(false);
    };

    const dataRoles = [
        { name: 'admin' },
        { name: 'teacher' },
        { name: 'ta' },
    ]


    useEffect(() => {
        getUser();
    }, [])



    const getUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/${subjectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);

            }
            const dataUser = await response.json();
            setDataUsers(dataUser.users);
            setIsLoadingData(false);
        } catch (error) {
            console.error('Error fetching labs:', error);
            setIsLoadingData(false);
        }
    }

    if (password?.length < 4) {
        errors.push("Password must be 4 characters or more.");
    }
    if ((password?.match(/[A-Z]/g) || []).length < 1) {
        errors.push("Password must include at least 1 upper case letter");
    }
    if ((password?.match(/[^a-z0-9]/gi) || []).length < 1) {
        errors.push("Password must include at least 1 symbol.");
    }


    const handleSubmitUser = async (dataForm) => {
        setStatusUpdate(true);
        try {
            const data = {
                email: dataForm.email,
                name: dataForm.name,
                password: dataForm.password,
                role: "ta",
                image: '/mind-4eve-4.png',
                subjectId

            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStatusUpdate(false);
                getUser();
                setOpenSuccess(true);
            } else {
                setStatusUpdate(false);
                setOpenError(true);
                const error = await response.json();
                setTextError(error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the data');
        }
    }

    const handleDeleteUser = async (id) => {
        setStatusUpdate(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/subject/user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
                },
                body: JSON.stringify({ id: id, subjectId: subjectId })
            });

            if (response.ok) {
                setStatusUpdate(false);
                getUser();
                setOpenSuccessDelete(true);

            } else {
                setStatusUpdate(false);
                const error = await response.json();
                setTextError(error.error);
                setOpenErrorDelete(true);


            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the data');
        }
    }

    const openDelete = (id) => {
        onOpenDelete();
        const user = dataUsers.find(user => user.id === id);
        setDataDeleteUser(user);
    }

    const [selectedKey, setSelectedKey] = useState(null);

    const addUser = async () => {
        setStatusUpdate(true);
        try {
            const data = {
                id: selectedKey,
                subjectId
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStatusUpdate(false);
                getUser();
                setOpenSuccess(true);
            } else {
                setStatusUpdate(false);
                setOpenError(true);
                const error = await response.json();
                setTextError(error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the data');
        }
    }

    const onSelectionChange = (id) => {
        setSelectedKey(id);
    };
    const openCreate = () => {
        getCheckUser();
    }

    const getCheckUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/check/${subjectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);

            }
            const dataUser = await response.json();
            setDataUserCheck(dataUser.users);
            onOpenEdit();
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    }

    const filteredItems = useMemo(() => {
        let filteredUsers = [...dataUsers]

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        return filteredUsers
    }, [dataUsers, filterValue, hasSearchFilter])

    const rowsPerPage = 5
    const [page, setPage] = useState(1)
    const pages = Math.ceil(filteredItems.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems])

    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'name',
        direction: 'ascending'
    })

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue('')
        }
    }, [])

    const onClear = useCallback(() => {
        setFilterValue('')
        setPage(1)
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex items-end justify-between gap-3'>
                    <Input
                        isClearable
                        className='w-full sm:max-w-[44%]'
                        placeholder='Search by user...'
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    {(session.user.role === 'admin' || session.user.role === 'teacher') && (
                        <div>
                            <Button color="primary" onPress={openCreate}><IoIosAdd className='text-xl' />Add user</Button>
                            <Button color="warning" onPress={onOpenAdd} className='ml-3'><FaUserPlus className='text-xl' />Create user</Button>
                        </div>
                    )}

                </div>

            </div>
        )
    }, [filterValue, onSearchChange, onClear])

    return (
        <>
            <Table
                aria-label='Users table'
                topContent={topContent}
                className={`${kanit.className}`}
                topContentPlacement='outside'
                bottomContent={
                    <div className='flex w-full justify-center'>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={page => setPage(page)}
                        />
                    </div>
                }
                bottomContentPlacement='outside'
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                classNames={{
                    wrapper: 'min-h-[222px]'
                }}
            >
                <TableHeader columns={columns}>
                    {column => (
                        <TableColumn
                            key={column.key}
                            {...(column.key === 'name' ? { allowsSorting: true } : {})}
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody className={`${kanit.className}`} items={sortedItems} emptyContent={'No user to display.'} isLoading={isLoadingData} loadingContent={<Spinner label="Loading..." />}>
                    {user => (
                        <TableRow key={user.id}>
                            {columnKey => <TableCell>{renderCell(user, columnKey, openDelete, session)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size='sm' className={`${kanit.className}`}>
                <ModalContent>
                    {(onCloseAdd) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create user</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4"
                                    validationBehavior="native"
                                    onReset={() => {
                                        setCreateUser(null);
                                        setPassword(null);
                                        onCloseAdd();
                                    }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        let data = Object.fromEntries(new FormData(e.currentTarget));
                                        setCreateUser(JSON.stringify(data));
                                        handleSubmitUser(data);
                                        onCloseAdd();
                                    }}
                                >
                                    <Input
                                        isRequired
                                        errorMessage="Please enter a valid name"
                                        label="Name"
                                        labelPlacement="outside"
                                        name="name"
                                        placeholder="Enter your name"
                                        type="text"
                                    />

                                    <Input
                                        isRequired
                                        errorMessage="Please enter a valid email"
                                        label="Email"
                                        labelPlacement="outside"
                                        name="email"
                                        placeholder="Enter your email"
                                        type="email"
                                    />

                                    <Input
                                        isRequired
                                        errorMessage={() => (
                                            <ul>
                                                {errors.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        )}
                                        isInvalid={errors.length > 0}
                                        label="Password"
                                        labelPlacement="outside"
                                        name="password"
                                        placeholder="Enter your password"
                                        type="password"
                                        value={password}
                                        onValueChange={setPassword}
                                    />

                                    <div className="flex gap-2 justify-end w-full mb-2">
                                        <Button type="reset" onPress={onCloseAdd} color="danger" variant="flat">
                                            Cancel
                                        </Button>
                                        <Button color="primary" type="submit" isLoading={statusUpdate}>
                                            Create
                                        </Button>

                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} size='sm' className={`${kanit.className}`}>
                <ModalContent>
                    {(onCloseEdit) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add user</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4"
                                    validationBehavior="native"
                                    onReset={() => {
                                        onCloseEdit();
                                    }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        addUser();
                                        onCloseEdit();
                                    }}
                                >
                                    <Autocomplete
                                        isRequired
                                        allowsCustomValue={true}
                                        defaultItems={dataUserCheck}
                                        label="Name"
                                        placeholder="Search an user"
                                        labelPlacement="outside"
                                        onSelectionChange={onSelectionChange}
                                    >
                                        {(item) => (
                                            <AutocompleteItem key={item.id} textValue={item.name}>
                                                <div className="flex gap-2 items-center">
                                                    <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.image} />
                                                    <div className="flex flex-col">
                                                        <span className="text-small">{item.name}</span>
                                                        <span className="text-tiny text-default-400">{item.email}</span>
                                                    </div>
                                                </div>
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>



                                    <div className="flex gap-2 justify-end w-full mb-2">
                                        <Button type="reset" onPress={onCloseEdit} color="danger" variant="flat">
                                            Cancel
                                        </Button>
                                        <Button color='primary' type="submit" isLoading={statusUpdate}>
                                            Add
                                        </Button>

                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} size='md' className={`${kanit.className}`}>
                <ModalContent>
                    {(onCloseDelete) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delete user
                                <p className='text-sm p-4 bg-red-200 rounded-md'>Warning: <span className='font-light'>This action is not reversible. Please be certain.</span></p>
                            </ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4"
                                    validationBehavior="native"
                                    onReset={() => {
                                        setDeleteUser(null);
                                        onCloseDelete;
                                    }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        let data = Object.fromEntries(new FormData(e.currentTarget));
                                        setDeleteUser(JSON.stringify(data))
                                        handleDeleteUser(dataDeleteUser.id);
                                        // console.log(data);
                                        onCloseDelete();
                                    }}
                                >
                                    <p className='font-light text-sm'>Enter the email <span className='font-medium'>{dataDeleteUser.email}</span> to continue:</p>

                                    <Input
                                        isRequired
                                        errorMessage="Please enter a valid email"
                                        name="email"
                                        type="email"
                                        defaultValue={deleteUser?.email}
                                        onChange={(e) => setDeleteUser({ ...deleteUser, email: e.target.value })}
                                    />

                                    <div className="flex gap-2 justify-end w-full mb-2">
                                        <Button type="reset" onPress={onCloseDelete} color="default" variant="ghost">
                                            Cancel
                                        </Button>
                                        <Button color='danger' type="submit" isLoading={statusUpdate} isDisabled={deleteUser?.email == dataDeleteUser?.email ? false : true}>
                                            Delete
                                        </Button>

                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseAdd} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseAdd}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Add user success!</AlertTitle>
                    <p>Add {createUser?.name} success.</p>
                </Alert>
            </Snackbar>

            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseAddError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseAddError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Add user error!</AlertTitle>
                    <p>{textError}</p>
                </Alert>
            </Snackbar>

            <Snackbar open={openSuccessEdit} autoHideDuration={6000} onClose={handleCloseEdit} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseEdit}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Edit user success!</AlertTitle>
                    <p>Edit {editUser?.name} success.</p>
                </Alert>
            </Snackbar>

            <Snackbar open={openErrorEdit} autoHideDuration={6000} onClose={handleCloseEditError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseEditError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Edit user error!</AlertTitle>
                    <p>{textError}</p>
                </Alert>
            </Snackbar>

            <Snackbar open={openSuccessDelete} autoHideDuration={6000} onClose={handleCloseDelete} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseDelete}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Delete user success!</AlertTitle>
                    <p>Delete {editUser?.name} success.</p>
                </Alert>
            </Snackbar>

            <Snackbar open={openErrorDelete} autoHideDuration={6000} onClose={handleCloseEditDelete} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseEditDelete}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={`${kanit.className}`}
                >
                    <AlertTitle>Delete user error!</AlertTitle>
                    <p>{textError}</p>
                </Alert>
            </Snackbar>
        </>
    )
}