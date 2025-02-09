import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../../utils/dbcloud";
import { z } from 'zod';

export async function GET(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const promisePool = mysqlPool.promise();
        let [check] = await promisePool.query('SELECT * FROM titelwork WHERE idcourse = ? AND typework = ? AND delete_at IS NULL',[id , 1]);

        return NextResponse.json(check); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}