'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Button, Form, Spinner, Switch, cn, Tooltip } from "@heroui/react"
import { Select, SelectItem } from "@heroui/react";
import { User, columns, renderCell } from './columns'
import { SearchIcon } from './icons'
import { IoIosAdd } from "react-icons/io";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Checkbox } from "@heroui/react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Prompt } from "next/font/google";
import Link from "next/link";
import Image from 'next/image'
import { CiCircleInfo } from "react-icons/ci";

const kanit = Prompt({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

export default function DataTable({ id }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filterValue, setFilterValue] = useState('')
  const hasSearchFilter = Boolean(filterValue)
  const [dataLabs, setDataLabs] = useState([]);
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure(); const currentDate = new Date().toISOString();
  const [createBooking, setCreateBooking] = useState(null);
  const [editLabs, setEditLabs] = useState(null);
  const [deleteLabs, setDeleteLabs] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSuccessEdit, setOpenSuccessEdit] = useState(false);
  const [openErrorEdit, setOpenErrorEdit] = useState(false);
  const [openSuccessDelete, setOpenSuccessDelete] = useState(false);
  const [openErrorDelete, setOpenErrorDelete] = useState(false);
  const [textError, setTextError] = useState('');
  const [dataRooms, setDataRooms] = useState([]);
  const [dataSubjects, setDataSubjects] = useState([]);
  const [isSelected, setIsSelected] = useState(true);
  const [dataDeleteLabs, setDataDeleteLabs] = useState(null);
  const [isSelectedRe, setIsSelectedRe] = useState(false);


  const handleClose = (event, reason) => {
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
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (id) {
      getLab();
      getRoom();
    }
  }, [id]);


  const getLab = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/labs/${id}`, {
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
      const dataLabs = await response.json();
      setDataLabs(dataLabs.lab);
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  }

  const getRoom = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/room`, {
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
      const dataRooms = await response.json();
      setDataRooms(dataRooms);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  }


  const handleSubmitLab = async (data) => {
    setStatusUpdate(true);

    try {
      const dataForm = {
        createdAt: currentDate,
        name: data.name,
        subject: id,
        room: data.room,
        image: '/mind-4eve-2.png',
        status: 'inactive',
        redirect: isSelectedRe ? data.redirect : null
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/labs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
        },
        body: JSON.stringify(dataForm)
      });

      if (response.ok) {
        setStatusUpdate(false);
        getLab();
        setOpenSuccess(true);
        cancelAdd();
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

  const handEditLabs = async (id) => {
    setStatusUpdate(true);
    try {
      const data = {
        name: editLabs.name,
        status: isSelected ? 'active' : 'inactive'
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/labs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatusUpdate(false);
        getLab();
        setOpenSuccessEdit(true);

      } else {
        setStatusUpdate(false);
        setOpenErrorEdit(true);
        const error = await response.json();
        setTextError(error.error);


      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while submitting the data');
    }
  }

  const handleDeleteLabs = async (id) => {
    setStatusUpdate(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/labs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ""
        }
      });

      if (response.ok) {
        setStatusUpdate(false);
        getLab();
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

  const cancelAdd = () => {
    setCreateBooking(null);
  }

  const filteredItems = useMemo(() => {
    let filteredUsers = [...dataLabs]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredUsers
  }, [dataLabs, filterValue, hasSearchFilter])

  const openEdit = (id) => {
    onOpenEdit();
    const lab = dataLabs.find(lab => lab.id === id);
    setEditLabs(lab);
    setIsSelected(lab.status === 'active');
  }

  const openDelete = (id) => {
    onOpenDelete();
    const lab = dataLabs.find(lab => lab.id === id);
    setDataDeleteLabs(lab);
  }

  const rowsPerPage = 6
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
            placeholder='Search by booking...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Button color="primary" onPress={onOpenAdd}><IoIosAdd className={`text-xl ${kanit.className}`} />Add booking</Button>
        </div>

      </div>
    )
  }, [filterValue, onSearchChange, onClear])

  return (
    <>
      <Table
        aria-label='Users table'
        className={`${kanit.className}`}
        topContent={topContent}
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
              {...(column.key === 'name' || column.key === 'createdAt' ? { allowsSorting: true } : {})}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems} emptyContent={'No booking to display.'} isLoading={isLoadingData} loadingContent={<Spinner label="Loading..." />}>
          {user => (
            <TableRow key={user.id}>
              {columnKey => <TableCell>{renderCell(user, columnKey, openEdit, openDelete)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size='sm' className={`${kanit.className}`}>
        <ModalContent>
          {(onCloseAdd) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add booking lab</ModalHeader>
              <ModalBody>
                <Form
                  className="w-full flex flex-col gap-4"
                  validationBehavior="native"
                  onReset={() => {
                    setCreateBooking(null);
                    onCloseAdd();
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));
                    setCreateBooking(JSON.stringify(data));
                    handleSubmitLab(data);
                    onCloseAdd();
                    // console.log(data);
                  }}
                >
                  <Input
                    isRequired
                    errorMessage="Please enter a valid booking name"
                    label="Booking name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter your booking name"
                    type="text"
                  />

                  <Select label="Room" placeholder="Select an room" errorMessage="Please enter a valid room" name="room" labelPlacement="outside" isRequired>
                    {dataRooms.map((room) => (
                      <SelectItem key={room.id}>{room.name}</SelectItem>
                    ))}
                  </Select>

                  <div className="flex">
                    <Checkbox isSelected={isSelectedRe} onValueChange={setIsSelectedRe}>
                      <p className='text-sm'>Add ID Lab score</p>
                    </Checkbox>
                    <Tooltip content="For subjects that use the sc.osp.dev scoring system">
                      <CiCircleInfo />
                    </Tooltip>
                  </div>

                  {isSelectedRe && (
                    <Input
                      isRequired
                      errorMessage="Please enter a valid Scoring ID"
                      label="Scoring ID"
                      labelPlacement="outside"
                      name="redirect"
                      placeholder="Enter your Scoring ID"
                      type="number"
                    />
                  )}

                  <div className="flex gap-2 justify-end w-full mb-2">
                    <Button type="reset" color="danger" variant="flat">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" isLoading={statusUpdate}>
                      Add
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
              <ModalHeader className="flex flex-col gap-1">Edit user</ModalHeader>
              <ModalBody>
                <Form
                  className="w-full flex flex-col gap-4"
                  validationBehavior="native"
                  onReset={() => {
                    setEditLabs(null);
                    onCloseEdit;
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));
                    setEditLabs(JSON.stringify(data));
                    handEditLabs(editLabs.id);
                    onCloseEdit();
                    // console.log(data);
                  }}
                >
                  <Input
                    isRequired
                    errorMessage="Please enter a valid booking name"
                    label="Booking name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter your booking name"
                    type="text"
                    defaultValue={editLabs?.name}
                    onChange={(e) => setEditLabs({ ...editLabs, name: e.target.value })}
                  />

                  <Switch
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
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

                  <div className="flex gap-2 justify-end w-full mb-2">
                    <Button type="reset" onPress={onCloseEdit} color="danger" variant="flat">
                      Cancel
                    </Button>
                    <Button color='warning' type="submit" isLoading={statusUpdate}>
                      Edit
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
                    setDeleteLabs(null);
                    onCloseDelete;
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));
                    setDeleteLabs(JSON.stringify(data))
                    handleDeleteLabs(dataDeleteLabs.id);
                    // console.log(data);
                    onCloseDelete();
                  }}
                >
                  <p className='font-light text-sm'>Enter the name lab <span className='font-medium'>{dataDeleteLabs.name}</span> to continue:</p>

                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    name="name"
                    type="name"
                    defaultValue={deleteLabs?.name}
                    onChange={(e) => setDeleteLabs({ ...deleteLabs, name: e.target.value })}
                  />

                  <div className="flex gap-2 justify-end w-full mb-2">
                    <Button type="reset" onPress={onCloseDelete} color="default" variant="ghost">
                      Cancel
                    </Button>
                    <Button color='danger' type="submit" isLoading={statusUpdate} isDisabled={deleteLabs?.name == dataDeleteLabs?.name ? false : true}>
                      Delete
                    </Button>

                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Snackbar open={openSuccess} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          className={`${kanit.className}`}
        >
          <AlertTitle>Add booking lab success!</AlertTitle>
          <p>Add {createBooking?.name} success.</p>
        </Alert>
      </Snackbar>

      <Snackbar open={openError} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseAddError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          className={`${kanit.className}`}
        >
          <AlertTitle>Add booking lab error!</AlertTitle>
          {textError}
        </Alert>
      </Snackbar>

      <Snackbar open={openSuccessEdit} autoHideDuration={4000} onClose={handleCloseEdit} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseEdit}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          className={`${kanit.className}`}
        >
          <AlertTitle>Edit booking lab success!</AlertTitle>
          <p>Edit {editLabs?.name} success.</p>
        </Alert>
      </Snackbar>

      <Snackbar open={openErrorEdit} autoHideDuration={4000} onClose={handleCloseEditError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseEditError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          className={`${kanit.className}`}
        >
          <AlertTitle>Edit booking lab error!</AlertTitle>
          {textError}
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
          <p>Delete {deleteLabs?.name} success.</p>
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