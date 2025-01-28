import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../../../utils/db";
import { z } from 'zod';

export async function GET(req, { params }) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        const { id } = await params
        const promisePool = mysqlPool.promise();
        let [users] = await promisePool.query('SELECT User.id, User.name, User.email, User.image, User.role FROM User LEFT JOIN Enllo ON User.id = Enllo.userid AND Enllo.subjectid = ? WHERE Enllo.userid IS NULL', [id]);
        
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