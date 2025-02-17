import { NextResponse } from 'next/server';
import { mysqlPool } from "../../../../utils/db";

export async function POST(req) {
    try {
        const key = req.headers.get('x-requested-enter');
        if (key !== process.env.NEXT_PUBLIC_API_HEAS) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        const body = await req.json();
        const { token } = body
        console.log(token)
        const promisePool = mysqlPool.promise();

        let [userToken] = await promisePool.query('SELECT email,expiresAt FROM Password_reset WHERE token = ?', [token]);
        if (userToken.length === 0) {
            return NextResponse.json(
                { error: 'Token not found' },
                { status: 404 }
            );
        }

        const tokenExpiry = new Date(userToken[0].expiresAt);
        console.log(userToken[0].expiresAt);
        if (new Date() > tokenExpiry) {
            await promisePool.query('DELETE FROM Password_reset WHERE token = ?', [token]);
            return NextResponse.json(
                { error: 'Token expired' },
                { status: 400 }
            );
        }

        return NextResponse.json(userToken[0]);
    } catch (error) {
        console.error('Error fetching year:', error);
        return NextResponse.json(
            { error: 'Failed to fetch year: ' + error.message },
            { status: 500 }
        );
    }
}