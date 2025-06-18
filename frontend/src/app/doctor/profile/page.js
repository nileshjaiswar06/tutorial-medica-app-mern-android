"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function DoctorProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Not provided";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");

    if (!user || !token) {
      toast.error("Please login to view your profile");
      router.push("/login");
      return;
    }

    if (user.role !== "doctor") {
      toast.error("Access denied. This page is for doctors only.");
      router.push("/login");
      return;
    }

    setUserData(user);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl rounded-xl overflow-hidden border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 p-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-green-300 shadow-md">
                <AvatarImage src={userData.profilePicture || "/default-avatar.png"} />
                <AvatarFallback className="bg-green-200 text-green-800 text-3xl font-semibold">
                  {userData.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-extrabold text-green-800 tracking-tight">
                  Dr. {userData.name}
                </CardTitle>
                <Badge variant="outline" className="mt-2 px-3 py-1 text-sm bg-green-200 text-green-800 font-semibold rounded-full shadow-sm">
                  Doctor
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <div className="space-y-6 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-green-700 border-b-2 border-green-200 pb-2">Profile Information</h3>
              <div className="space-y-3">
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900 font-normal">{userData.email || "Not provided"}</span>
                </p>
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Contact Number:</span>
                  <span className="text-gray-900 font-normal">{userData.profile?.phone || "Not provided"}</span>
                </p>
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Date of Birth:</span>
                  <span className="text-gray-900 font-normal">
                    {userData.profile?.dateOfBirth ? new Date(userData.profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                  </span>
                </p>
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Age:</span>
                  <span className="text-gray-900 font-normal">{calculateAge(userData.profile?.dateOfBirth)} years</span>
                </p>
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Specialization:</span>
                  <span className="text-gray-900 font-normal">{userData.profile?.specialization || "Not provided"}</span>
                </p>
                <p className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="text-gray-900 font-normal">{userData.profile?.address || "Not provided"}</span>
                </p>
              </div>
            </div>

            <Separator className="my-8 bg-green-200" />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/doctor/dashboard")}
                className="px-6 py-3 text-lg font-semibold border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-200 rounded-lg"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/doctor/profile/edit")}
                className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors duration-200 rounded-lg"
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 