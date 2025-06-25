"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function PatientProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    profile: {
      phone: '',
      dateOfBirth: null,
      gender: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to edit your profile");
      router.push("/login");
      return;
    }
    if (user.role !== "patient") {
      toast.error("Access denied. This page is for patients only.");
      router.push("/login");
      return;
    }
    setFormData({
      email: user.email || '',
      name: user.name || '',
      profile: {
        phone: user.profile?.phone || '',
        dateOfBirth: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth) : null,
        gender: user.profile?.gender || '',
        address: user.profile?.address || ''
      }
    });
  }, [router]);

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

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.name) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.profile.phone) {
      toast.error('Contact Number is required');
      return false;
    }
    if (!formData.profile.dateOfBirth) {
      toast.error('Date of Birth is required');
      return false;
    }
    if (!formData.profile.gender) {
      toast.error('Gender is required');
      return false;
    }
    if (!formData.profile.address) {
      toast.error('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(true);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const updateData = {
        email: formData.email,
        name: formData.name,
        profile: {
          ...formData.profile,
          age: calculateAge(formData.profile.dateOfBirth),
          dateOfBirth: formData.profile.dateOfBirth ? format(formData.profile.dateOfBirth, 'yyyy-MM-dd') : '',
        }
      };
      const response = await axios.put(
        "http://localhost:5000/v1/user",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        toast.success("Profile updated successfully!");
        router.push("/patient/profile");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Update failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <button
            type="button"
            aria-label="Close edit profile"
            onClick={() => router.push('/patient/profile')}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <X size={24} />
          </button>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">Edit Profile</CardTitle>
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
                  {showError && !formData.name && (
                    <p className="text-red-500 text-sm mt-1">Name is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your Email"
                    className="mt-1.5"
                  />
                  {showError && !formData.email && (
                    <p className="text-red-500 text-sm mt-1">Email is required</p>
                  )}
                </div>
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
                    maxDate={new Date()}
                  />
                  {showError && !formData.profile.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">Date of Birth is required</p>
                  )}
                </div>
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
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <a
                  href="/patient/profile/delete"
                  className="mt-2 text-center text-red-600 underline hover:text-red-800 text-sm"
                >
                  Delete Account
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 