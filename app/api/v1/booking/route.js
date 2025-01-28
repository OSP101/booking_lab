import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod';

export async function POST(req) {
    try {
        const token = req.headers.get('x-requested-enter');
        if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        const { bookingPin, studentId, tableId } = await req.json();
        if (!bookingPin || !studentId || !tableId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const promisePool = mysqlPool.promise();

        let [check1] = await promisePool.query('SELECT * FROM Labs WHERE pin = ?', [bookingPin]);
        if (check1.length == 0) {
            return NextResponse.json(
                { message: "PIN is not available." },
                { status: 400 }
            );
        }
        if (check1[0].status == "inactive") {
            return NextResponse.json(
                { message: "Booking inactive." },
                { status: 400 }
            );
        }

        let counter = 0;

        let [check2] = await promisePool.query('SELECT status FROM Queue WHERE table_id = ? AND lab_id = ?', [tableId, check1[0].id]);
        if (check2.length > 0) {
            for (let i = 0; i < check2.length; i++) {
                if (check2[i].status !== "done") {
                    return NextResponse.json(
                        { message: "The table is not available." },
                        { status: 400 }
                    );
                }
                counter++;
            }

        }

        let [check6] = await promisePool.query('SELECT status FROM Queue WHERE student_id = ? AND lab_id = ?', [studentId, check1[0].id]);
        if (check6.length > 0) {
            return NextResponse.json(
                { message: "Student ID has been reserved." },
                { status: 400 }
            );
        }

        let [check7] = await promisePool.query('SELECT number_table FROM Rooms WHERE id = ?', [check1[0].room]);
        if (tableId <= 0 || tableId > check7[0].number_table) {
            return NextResponse.json(
                { message: "Table ID is not available." },
                { status: 400 }
            );
        }

        let [queue] = await promisePool.query('INSERT INTO Queue(table_id, student_id, status, lab_id) VALUES (?, ?, ?, ?)', [tableId, studentId, "in-progress", check1[0].id]);
        let [check4] = await promisePool.query('SELECT COUNT(status) AS counter FROM Queue WHERE lab_id = ? AND status != "done"', [check1[0].id]);
        let [check3] = await promisePool.query('SELECT Labs.*, Subjects.name AS sName,Queue.create_at  FROM Labs JOIN Subjects ON Labs.subject = Subjects.id JOIN Queue ON Queue.lab_id = Labs.id WHERE Labs.id = ?', [check1[0].id]);
        const idQueue = queue.insertId;
        let [check5] = await promisePool.query('SELECT create_at FROM Queue WHERE id = ?', [idQueue]);


        const data = {
            bookingDetail: check3[0],
            roomDetail: queue,
            counter: check4[0].counter,
            create_at: check5[0].create_at,
            tableId
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