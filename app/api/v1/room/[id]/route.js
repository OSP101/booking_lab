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
        let [booking1] = await promisePool.query('SELECT Labs.*, Subjects.name AS sName FROM Labs JOIN Subjects ON Labs.subject = Subjects.id WHERE Labs.id = ?', [id]);
        let [booking2] = await promisePool.query('SELECT table_id, name, x, y,`col`,`rows`,`zone` FROM Room_detail WHERE room_id = ?', [booking1[0].room]);
        
        const data = {
            roomDetail: booking2,
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