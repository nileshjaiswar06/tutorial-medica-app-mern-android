import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await axios.post('http://localhost:5000/v1/auth/signup', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Something went wrong',
        error: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 