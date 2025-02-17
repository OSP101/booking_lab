import { NextResponse } from 'next/server'
import { mysqlPool } from "../../../../utils/db";
import { authenticateApiKey } from '../../../../lib/encrypt'
import bcrypt from 'bcryptjs'

const postRecoveryHandler = async (req) => {
try {
        const body = await req.json();
        const promisePool = mysqlPool.promise();

        const { email, password } = body;
        console.log(email, password)
        if (!email || !password) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const hashedPassword = bcrypt.hashSync(password, 10)
    
        let [userUpdate] = await promisePool.query('UPDATE User SET password = ? WHERE email = ?', [hashedPassword, email]);
        await promisePool.query('DELETE FROM Password_reset WHERE email = ?', [email]);
        
        return NextResponse.json(userUpdate,{ message: "รีเซ็ตรหัสเรียบร้อยแล้ว", status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create reset: ' + error },
            { status: 500 }
        );
    }

}

export const POST = authenticateApiKey(postRecoveryHandler);