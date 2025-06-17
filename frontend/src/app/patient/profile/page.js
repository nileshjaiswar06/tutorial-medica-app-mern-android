"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function PatientProfilePage() {
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

    if (user.role !== "patient") {
      toast.error("Access denied. This page is for patients only.");
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
        <Card className="shadow-lg">
          <CardHeader className="bg-green-50">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.profilePicture || "/default-avatar.png"} />
                <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-green-800">
                  {userData.name}
                </CardTitle>
                <Badge variant="outline" className="mt-2 bg-green-100 text-green-800">
                  Patient
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {userData.email}</p>
                  <p><span className="font-medium">Phone:</span> {userData.profile?.phone || "Not provided"}</p>
                  <p><span className="font-medium">Date of Birth:</span> {userData.profile?.dateOfBirth ? new Date(userData.profile.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                  <p><span className="font-medium">Age:</span> {calculateAge(userData.profile?.dateOfBirth)} years</p>
                  <p><span className="font-medium">Location:</span> {userData.profile?.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/patient/dashboard")}
                className="text-green-800 border-green-800 hover:bg-green-50"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/patient/profile/edit")}
                className="bg-green-600 hover:bg-green-700"
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