'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);


  useEffect(() => {
    // Request OTP when page loads
    handleRequestOtp();
  }, []);

  const handleRequestOtp = async () => {
    setRequestLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Frontend - Token from localStorage:', token);
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/api/auth/email-verify/request', {
        headers: {
          'Authorization': token
        }
      });

      if (response.data.message === "verification request sent successful") {
        toast.success('OTP sent to your email!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError(false);

    try {
      const token = localStorage.getItem('accessToken');
      console.log('Frontend - Token from localStorage (submit):', token);
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post('/api/auth/email-verify/submit', 
        { otp },
        {
          headers: {
            'Authorization': token
          }
        }
      );

      if (response.data.message === "verification successful") {
        toast.success('Email verified successfully!');
        // Redirect based on role
        const userRole = response.data.data.role;
        router.push(`/${userRole}/dashboard`);
      }else {
        toast.error(response.data.message || 'invalid OTP');
      }
    } catch (error) {
      setOtpError(true);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Please enter the OTP sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
              { otpError && (
                <p className="text-red-500 text-sm">Invalid OTP</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleRequestOtp}
                disabled={requestLoading}
              >
                {requestLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 