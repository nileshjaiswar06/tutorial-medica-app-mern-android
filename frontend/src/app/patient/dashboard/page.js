'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, FileText, User, LogOut, Clock, Stethoscope } from 'lucide-react';

export default function PatientDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/patient/dashboard" className="text-xl font-bold text-green-600">
                Medilink
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/patient/appointments" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>My Appointments</span>
                </Link>
                <Link href="/patient/doctors" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                  <Stethoscope className="w-5 h-5" />
                  <span>Find Doctors</span>
                </Link>
                <Link href="/patient/medical-records" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                  <FileText className="w-5 h-5" />
                  <span>Medical Records</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/patient/profile" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-green-600 flex items-center space-x-1"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search doctors by name, specialization, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <CardDescription>View and manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Medical Records</CardTitle>
              <CardDescription>Access your medical history and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Records
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Book Appointment</CardTitle>
              <CardDescription>Schedule a new appointment with a doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                No upcoming appointments scheduled
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Medical Records */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                No recent medical records available
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 