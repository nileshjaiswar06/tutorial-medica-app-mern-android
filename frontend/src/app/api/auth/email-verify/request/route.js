import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { 
          message: "authentication failed",
          error: "invalid access",
          data: null
        },
        { status: 403 }
      );
    }
    
    const response = await axios.get('http://localhost:5000/v1/auth/email-verify/request', {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Email verification request error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Something went wrong',
        error: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 