import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { otp } = await request.json();
    const token = request.headers.get('authorization');
    
    console.log('API Route - Raw token:', token);
    
    if (!token) {
      return NextResponse.json(
        { message: 'authentication failed', error: 'no token provided' },
        { status: 403 }
      );
    }

    const response = await axios.post(
      'http://localhost:5000/v1/auth/email-verify/submit',
      { otp },
      {
        headers: {
          'Authorization': token
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Email verification submit error:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        message: 'authentication failed', 
        error: error.response?.data?.error || 'invalid access',
        data: null
      },
      { status: 403 }
    );
  }
} 