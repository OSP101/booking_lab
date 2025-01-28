import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../utils/db";
import { z } from 'zod';


export async function DELETE(req) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id, subjectId } = await req.json();
        console.log(subjectId, id)
        const promisePool = mysqlPool.promise();
        let [user] = await promisePool.query('DELETE FROM Enllo WHERE userid = ? AND subjectid = ?', [id, subjectId]);

        return NextResponse.json(user); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}