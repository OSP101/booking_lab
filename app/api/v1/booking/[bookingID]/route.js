import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../utils/db";
import { z } from 'zod';

export async function GET(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { bookingID } = await params
        const promisePool = mysqlPool.promise();
        let [booking1] = await promisePool.query('SELECT Labs.*, Subjects.name AS sName FROM Labs JOIN Subjects ON Labs.subject = Subjects.id WHERE Labs.id = ?', [bookingID]);
        
        const data = {
            bookingDetail: booking1[0],
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

async function createUniqueValue(pool, generateFunc, column, table) {
    let value;
    let isDuplicate = true;

    while (isDuplicate) {
        value = generateFunc(); // สุ่มค่าใหม่
        const [rows] = await pool.query(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`,
            [value]
        );
        isDuplicate = rows[0].count > 0; // ถ้าค่าซ้ำจะวนลูปต่อ
    }

    return value;
}

function generateRandomPin(length = 6) {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
}

export async function PUT(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
    const promisePool = mysqlPool.promise();
        const { bookingID } = await params
        const body = await req.json();
        const { status } = body
        let pin = null;
        if (!status) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        if (status == "active") {
            pin = await createUniqueValue(promisePool, () => generateRandomPin(6), "pin", "Labs");
        }
        if (status == "inactive") {
            pin = null;
        }
        
        let [booking1] = await promisePool.query('SELECT Labs.*, Subjects.name AS sName FROM Labs JOIN Subjects ON Labs.subject = Subjects.id WHERE Labs.id = ?', [bookingID]);
        let [lab] = await promisePool.query('UPDATE Labs SET status = ?, pin = ? WHERE id = ?', [ status, pin, booking1[0].id]);
        let [booking2] = await promisePool.query('SELECT Labs.*, Subjects.name AS sName FROM Labs JOIN Subjects ON Labs.subject = Subjects.id WHERE Labs.id = ?', [bookingID]);

        const data = {
            bookingDetail: booking2[0]
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