import React from "react";
import { useRouter } from 'next/navigation';
import { User, Tooltip, Chip } from "@heroui/react";
import { DeleteIcon, EditIcon, EyeIcon } from '../../components/icons';
import { Link } from "@heroui/react";


export const columns = [
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'role',
        label: 'Role'
    },
    {
        key: 'actions',
        label: 'Actions'
    }
]

const statusColorMap = {
    admin: "success",
    teacher: "secondary",
    ta: "warning",
};

export const renderCell = (user, columnKey, openDelete, session) => {
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
        case 'email':
            return <span>{user.email}</span>
        case "role":
            return (
                <Chip className="capitalize" color={statusColorMap[user.role]} size="sm" variant="flat">
                    {cellValue}
                </Chip>
            );
        
        case 'actions':
            return (
                (session.user.role === 'admin' || session.user.role === 'Teacher') && (
                    <div className='relative flex items-center gap-4'>
                    <Tooltip color='danger' content='Delete'>
                        <span className='cursor-pointer text-lg text-danger active:opacity-50' onClick={() => openDelete(user.id)}>
                            <DeleteIcon />
                        </span>
                    </Tooltip>
                </div>
                )
            )
        
        default:
            return cellValue
    }
}