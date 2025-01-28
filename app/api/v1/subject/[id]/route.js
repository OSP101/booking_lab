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
        let [sub] = await promisePool.query('SELECT Subjects.* FROM Subjects JOIN Enllo ON Subjects.id = Enllo.subjectid WHERE Enllo.userid = ?', [id]);

        return NextResponse.json(sub); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}

export async function POST(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const { userid } = await req.json();
        const promisePool = mysqlPool.promise();
        let [check] = await promisePool.query('SELECT * FROM Subjects JOIN Enllo ON Subjects.id = Enllo.subjectid WHERE Enllo.userid = ? AND Subjects.id = ?', [userid, id]);

        const data = {
            length: check.length,
            status: check.length > 0 ? true : false,
        }
        return NextResponse.json(data); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}