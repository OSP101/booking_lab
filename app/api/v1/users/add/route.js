import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../../utils/db";
import { z } from 'zod'
import { authenticateApiKey } from '../../../../../lib/encrypt'

const postAddUserHandler = async (req) => {
    try {
        const body = await req.json();
        const promisePool = mysqlPool.promise();
        // ตรวจสอบค่าที่จำเป็น
        const { id, subjectId } = body;
        if ( !id || !subjectId) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }
        let [sub2] = await promisePool.query('INSERT INTO Enllo(userid, subjectid) VALUES (?, ?)',[id, subjectId]);
        

        return NextResponse.json(sub2, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create lab: ' + error },
            { status: 500 }
        );
    }
};


export const POST = authenticateApiKey(postAddUserHandler);