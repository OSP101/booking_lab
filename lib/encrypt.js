import { NextResponse } from 'next/server';

// Middleware สำหรับตรวจสอบ API Key
export const authenticateApiKey = (handler) => {
  return async (req) => {
    const token = req.headers.get('x-requested-enter');

    if (token !== process.env.NEXT_PUBLIC_API_HEAS) {
      return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
    }

    return handler(req);
  };
};
