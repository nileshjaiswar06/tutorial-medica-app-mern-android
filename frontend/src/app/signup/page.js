'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    profile: {
      age: '',
      gender: '',
      specialization: '',
      address: ''
    }
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(true);
    if (!validateForm()) return; 
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/signup', formData);
      
      if (response.data) {
        // Store the access token
        if (response.data.data.accessToken) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
          toast.success('Account created successfully!');
          // Redirect to email verification page
          router.push('/verify-email');
        } else {
          throw new Error('No access token received');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.profile.age){
      toast.error('Age is required');
      return false;
    }
    if (!formData.profile.gender){
      toast.error('Gender is required');
      return false;
    }
    if (!formData.profile.address){
      toast.error('Address is required');
      return false;
    }
    if (formData.role === 'doctor' && !formData.profile.specialization) {
      toast.error('Specialization is required');
      return false;
    }
    return true;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to get started with your medical journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </div>

              <div>
                <Label>I am a</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient">Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor">Doctor</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="profile.age"
                  type="number"
                  value={formData.profile.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
                {showError && !formData.profile.age && (
                  <p className="text-red-500 text-sm mt-1">Age is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.profile.gender}
                  onValueChange={(value) => handleChange({ target: { name: 'profile.gender', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {showError && !formData.profile.gender && (
                  <p className="text-red-500 text-sm mt-1">Gender is required</p>
                )}
              </div>

              {formData.role === 'doctor' && (
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="profile.specialization"
                    type="text"
                    value={formData.profile.specialization}
                    onChange={handleChange}
                    placeholder="Enter your specialization"
                  />
                  {showError && formData.role === 'doctor' && !formData.profile.specialization && (
                    <p className="text-red-500 text-sm mt-1">Specialization is required</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="profile.address"
                  type="text"
                  value={formData.profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
              {showError && !formData.profile.address && (
                <p className="text-red-500 text-sm mt-1">Address is required</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 