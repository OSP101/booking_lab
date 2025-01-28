import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../utils/db";
import { z } from 'zod';


export async function GET(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const promisePool = mysqlPool.promise();
        let [users] = await promisePool.query('SELECT User.id, User.name, User.image, User.email, User.role FROM Enllo JOIN User ON User.id = Enllo.userid WHERE Enllo.subjectid = ?', [id]);
        
        const data = {
            length: users.length,
            users,
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const { name, email, role } = await req.json();
        console.log(name, email, role, id)
        const promisePool = mysqlPool.promise();
        let [user] = await promisePool.query('UPDATE User SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, id]);

        return NextResponse.json(user); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const promisePool = mysqlPool.promise();
        let [user] = await promisePool.query('DELETE FROM User WHERE id = ?', [id]);

        return NextResponse.json(user); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}