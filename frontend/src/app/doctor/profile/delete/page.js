"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function DoctorDeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete("http://localhost:5000/v1/user", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.success("Account deleted successfully.");
      router.push("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Delete failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-600">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-center text-red-700 font-semibold">
              Warning: This action is irreversible. All your data will be permanently deleted.
            </p>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Confirm Delete Account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/doctor/profile/edit")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold text-red-600 mb-4">Are you sure?</h2>
            <p className="mb-6">This action cannot be undone. Do you really want to delete your account?</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowModal(false);
                  handleDelete();
                }}
                disabled={loading}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 