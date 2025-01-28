import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod'
import { authenticateApiKey } from '../../../../lib/encrypt'

const postRoomHandler = async (req) => {
    try {
        const body = await req.json();
        console.log(body);
        const promisePool = mysqlPool.promise();
        // ตรวจสอบค่าที่จำเป็น
        const { roomid } = body;
        if (!roomid) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        let [rooms] = await promisePool.query('SELECT table_id AS id ,name ,x ,y FROM Room_detail WHERE room_id = ? ORDER BY table_id ASC',[roomid]);

        const data = {
            length: rooms.length,
            rooms,
        };

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create lab: ' + error },
            { status: 500 }
        );
    }
};

const getRoomsHandler = async (req) => {
    try {
        const promisePool = mysqlPool.promise();
        let [rooms] = await promisePool.query('SELECT * FROM Rooms ORDER BY id ASC');

        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch years: ' + error },
            { status: 500 }
        );
    }
};

export const GET = authenticateApiKey(getRoomsHandler);
export const POST = authenticateApiKey(postRoomHandler);