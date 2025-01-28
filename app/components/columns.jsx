import React from "react";
import { useRouter } from 'next/navigation';
import { User, Tooltip, Chip } from "@heroui/react";
import { DeleteIcon, EditIcon, EyeIcon } from '../components/icons';
import { Link } from "@heroui/react";

export const columns = [
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'createdAt',
        label: 'Date'
    },
    {
        key: 'room',
        label: 'Room'
    },
    {
        key: 'status',
        label: 'Status'
    },
    {
        key: 'actions',
        label: 'Actions'
    }
]

const statusColorMap = {
    active: "success",
    inactive: "danger",
};

export const renderCell = (user, columnKey, openEdit, openDelete) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
        case 'name':
            return (
                <User
                    avatarProps={{ radius: 'lg', src: user.image }}
                    description={user.subject}
                    name={cellValue}
                >
                    {user.email}
                </User>
            )
        case 'createdAt':
            return <span>{new Date(cellValue).toLocaleDateString()}</span>
        case 'room':
            return <span>{user.room}</span>
        case "status":
            return (
                <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                    {cellValue}
                </Chip>
            );
        case 'actions':
            return (
                <div className='relative flex items-center gap-4'>
                    <Link href={`/b/${user.subject}/booking/${user.id}`} target="_blank">
                        <Tooltip content='Details'>
                            <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                                <EyeIcon />
                            </span>
                        </Tooltip>
                    </Link>
                    <Tooltip content='Edit'>
                        <span className='cursor-pointer text-lg text-default-400 active:opacity-50' onClick={() => openEdit(user.id)}>
                            <EditIcon />
                        </span>
                    </Tooltip>
                    <Tooltip color='danger' content='Delete'>
                        <span className='cursor-pointer text-lg text-danger active:opacity-50' onClick={() => openDelete(user.id)}>
                            <DeleteIcon />
                        </span>
                    </Tooltip>
                </div>
            )
        default:
            return cellValue
    }
}