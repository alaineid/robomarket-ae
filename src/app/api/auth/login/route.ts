import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  console.log('Login attempt:', { email, password });

  // Dummy response for now
  return NextResponse.json({
    message: 'Login successful',
    email,
  });
}
