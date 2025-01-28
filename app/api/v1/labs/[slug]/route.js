import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../utils/db";
import { z } from 'zod';

export async function GET(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { slug } = await params
        const promisePool = mysqlPool.promise();
        let [lab] = await promisePool.query('SELECT * FROM Labs WHERE subject = ? ORDER BY createdAt ASC', [slug]);
        const data = {
            length: lab.length,
            lab,
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
        const { slug } = await params
        const body = await req.json();
        const { name, status } = body
        let pin = null;
        if (!status || !name) {
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

        
        let [lab] = await promisePool.query('UPDATE Labs SET name = ?, status = ?, pin = ? WHERE id = ?', [name, status, pin, slug]);

        return NextResponse.json(lab); // ส่งข้อมูลกลับ
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

        const { slug } = await params
        const promisePool = mysqlPool.promise();
        let [lab] = await promisePool.query('DELETE FROM Labs WHERE id = ?', [slug]);

        return NextResponse.json(lab); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}