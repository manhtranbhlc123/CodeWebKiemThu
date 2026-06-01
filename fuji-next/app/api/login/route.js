import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { BaseURL } from '@/app/utils/baseUrl';
export async function POST(request) {
  const { username, password } = await request.json();
  
  const res = await axios.post(`${BaseURL.auth}/login`, { username, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();

  if (res.ok && data.token) {
    cookies().set('token', data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60, 
      path: '/',
    });
    return NextResponse.json({ message: 'Login successful' });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}