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
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    profile: {
      phone: '',
      dateOfBirth: null,
      gender: '',
      specialization: '',
      address: ''
    }
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        dateOfBirth: date,
      }
    }));
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
      const finalFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          age: calculateAge(formData.profile.dateOfBirth),
          dateOfBirth: formData.profile.dateOfBirth ? format(formData.profile.dateOfBirth, 'yyyy-MM-dd') : '',
        }
      };

      const response = await axios.post('/api/auth/signup', finalFormData);
      
      if (response.data) {
        if (response.data.data.accessToken) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
          toast.success('Account created successfully!');
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
    if (!formData.profile.phone){
      toast.error('Contact Number is required');
      return false;
    }
    if (!formData.profile.dateOfBirth){
      toast.error('Date of Birth is required');
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
    if (formData.role === 'doctor' && calculateAge(formData.profile.dateOfBirth) < 22) {
      toast.error('Doctors must be at least 22 years old.');
      return false;
    }
    return true;
  }

  const doctorMaxDate = new Date();
  doctorMaxDate.setFullYear(doctorMaxDate.getFullYear() - 22);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-600">Create an Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign up to get started with your medical journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="mt-1.5"
                />
              </div>

              {/* Contact Number Input */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Contact Number</Label>
                <Input
                  id="phone"
                  name="profile.phone"
                  type="tel"
                  required
                  value={formData.profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="mt-1.5"
                />
                {showError && !formData.profile.phone && (
                  <p className="text-red-500 text-sm mt-1">Contact Number is required</p>
                )}
              </div>

              {/* Date of Birth Calendar */}
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                <DatePicker
                  selected={formData.profile.dateOfBirth}
                  onChange={handleDateChange}
                  dateFormat="P"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  placeholderText="Select your date of birth"
                  className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5 rounded-md h-10"
                  maxDate={doctorMaxDate}
                />
                {showError && !formData.profile.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">Date of Birth is required</p>
                )}
              </div>

              {/* Auto-calculated Age */}
              <div>
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  name="profile.age"
                  type="number"
                  readOnly
                  value={calculateAge(formData.profile.dateOfBirth)}
                  className="mt-1.5"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="text-sm font-normal">Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="text-sm font-normal">Doctor</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Gender Selection */}
              <div>
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select
                  value={formData.profile.gender}
                  onValueChange={(value) => handleChange({ target: { name: 'profile.gender', value } })}
                >
                  <SelectTrigger className="w-full mt-1.5">
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

              {/* Specialization Input (only for doctors) */}
              {formData.role === 'doctor' && (
                <div>
                  <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
                  <Input
                    id="specialization"
                    name="profile.specialization"
                    type="text"
                    required={formData.role === 'doctor'}
                    value={formData.profile.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics"
                    className="mt-1.5"
                  />
                  {showError && formData.role === 'doctor' && !formData.profile.specialization && (
                    <p className="text-red-500 text-sm mt-1">Specialization is required</p>
                  )}
                </div>
              )}

              {/* Address Input */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  name="profile.address"
                  type="text"
                  required
                  value={formData.profile.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="mt-1.5"
                />
                {showError && !formData.profile.address && (
                  <p className="text-red-500 text-sm mt-1">Address is required</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-200" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
            Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 