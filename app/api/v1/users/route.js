import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod'
import { authenticateApiKey } from '../../../../lib/encrypt'
import bcrypt from 'bcryptjs'

const getUsersHandler = async (req) => {
    try {

        const promisePool = mysqlPool.promise();
        let [users] = await promisePool.query('SELECT id, name, email, image, role FROM User');

        const data = {
            length: users.length,
            users,
        };

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch years: ' + error },
            { status: 500 }
        );
    }
};

const postAddUserHandler = async (req) => {
    try {
        const body = await req.json();
        const promisePool = mysqlPool.promise();
        // ตรวจสอบค่าที่จำเป็น
        const { email, name, password, role, image, subjectId } = body;
        if (!name || !email || !password || !role || !image || !subjectId) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }
        const hashedPassword = bcrypt.hashSync(password, 10)

        let [sub] = await promisePool.query('INSERT INTO User(name, email, password, image, role) VALUES (?, ?, ?, ?, ?)',[ name, email, hashedPassword, image, role]);
        const userId = sub.insertId;
        let [sub2] = await promisePool.query('INSERT INTO Enllo(userid, subjectid) VALUES (?, ?)',[userId, subjectId]);
        

        return NextResponse.json(sub,sub2, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create lab: ' + error },
            { status: 500 }
        );
    }
};


export const GET = authenticateApiKey(getUsersHandler);
export const POST = authenticateApiKey(postAddUserHandler);
