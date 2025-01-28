import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { z } from 'zod'
import { authenticateApiKey } from '../../../../lib/encrypt'

const getLabsHandler = async (req) => {
    try {
        const promisePool = mysqlPool.promise();
        let [labs] = await promisePool.query('SELECT * FROM Labs ORDER BY createdAt DESC');

        const data = {
            length: labs.length,
            labs,
        };

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch years: ' + error },
            { status: 500 }
        );
    }
};

function generateRandomId(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  async function createUniqueValue(pool, generateFunc, column, table) {
    let value;
    let isDuplicate = true;
  
    while (isDuplicate) {
      value = generateFunc(); // สุ่มค่าใหม่
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`,
        [value]
      );
      isDuplicate = rows[0].count > 0; // ถ้าค่าซ้ำจะวนลูปต่อ
    }
  
    return value;
  }




const postLabHandler = async (req) => {
    try {
        const body = await req.json();
        console.log(body);
        const promisePool = mysqlPool.promise();
        // ตรวจสอบค่าที่จำเป็น
        const { createdAt, name, image, subject, status, room } = body;
        if (!name || !image || !subject || !status || !room) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const id = await createUniqueValue(promisePool, () => generateRandomId(10), "id", "Labs");
    
        const [labResult] = await promisePool.query(
            'INSERT INTO Labs (id, createdAt, name, image, subject, status, room) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, createdAt, name, image, subject, status, room]
        );

        return NextResponse.json(labResult, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create lab: ' + error },
            { status: 500 }
        );
    }
};


export const GET = authenticateApiKey(getLabsHandler);
export const POST = authenticateApiKey(postLabHandler);