import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod'
import { authenticateApiKey } from '../../../../lib/encrypt'

const getSubjectsHandler = async (req) => {
    try {
        const promisePool = mysqlPool.promise();
        let [subjects] = await promisePool.query('SELECT * FROM Subjects ORDER BY id ASC');

        return NextResponse.json(subjects);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch years: ' + error },
            { status: 500 }
        );
    }
};

const postCheckHandler = async (req) => {
    try {
        const body = await req.json();
        const promisePool = mysqlPool.promise();
        // ตรวจสอบค่าที่จำเป็น
        const { id, name, userid, sst } = body;
        if (!id || !name) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        let [sub] = await promisePool.query('INSERT INTO Subjects(id, name, status, SST) VALUES (?, ?, ?, ?)',[id, name, "active", sst]);
        let [sub2] = await promisePool.query('INSERT INTO Enllo(userid, subjectid) VALUES (?, ?)',[userid, id]);
        

        return NextResponse.json(sub,sub2, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create lab: ' + error },
            { status: 500 }
        );
    }
};


export const GET = authenticateApiKey(getSubjectsHandler);
export const POST = authenticateApiKey(postCheckHandler);