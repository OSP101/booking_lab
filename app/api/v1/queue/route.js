import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod';

export async function POST(req) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        const { labId } = await req.json();
        if (!labId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const promisePool = mysqlPool.promise();

        let [check1] = await promisePool.query('SELECT table_id, student_id AS studentId, status, create_at AS time FROM Queue WHERE lab_id = ? AND status != ? ', [labId, "done"]);

        const data = {
            queue: check1
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

export async function PUT(req) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        const { labId, studentId, userId, status } = await req.json();
        if (!labId || !studentId || !userId || !status) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const promisePool = mysqlPool.promise();

        console.log(status, labId, studentId);

        if (status == "done") {
            let [check1] = await promisePool.query('DELETE FROM Queue WHERE lab_id = ? AND student_id = ?', [labId, studentId]);
            return NextResponse.json(check1);
        }
        if (status == "available" || status == "in-progress" || status == "progress" || status == "issue") {
            let [check1] = await promisePool.query('UPDATE Queue SET status = ? ,user_id = ? WHERE lab_id = ? AND student_id = ?', [status, userId, labId, studentId]);
            return NextResponse.json(check1);
        }

        
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}