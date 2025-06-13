import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-green-600">
                Medilink
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/signup" className="text-green-600 hover:text-green-700">Sign Up</Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/login" className="text-white">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Medilink
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground font-semibold">
            Your trusted platform for medical services and healthcare solutions.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-green-600">Find Doctors</h3>
              <p className="mt-2 text-muted-foreground">
                Connect with qualified healthcare professionals in your area. Get instant access to verified doctors and specialists.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-green-600">Book Appointments</h3>
              <p className="mt-2 text-muted-foreground">
                Schedule your medical appointments online with ease. Choose your preferred time slot and get instant confirmation.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-green-600">Medical Records</h3>
              <p className="mt-2 text-muted-foreground">
                Access and manage your medical history securely online. Keep track of your health journey in one place.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
