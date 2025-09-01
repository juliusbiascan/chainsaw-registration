import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/ThemeToggle/theme-toggle";
import Image from "next/image";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-screen w-full">
      <ScrollArea className="h-full w-full">
        <div className="min-h-screen flex">
          {/* Left Column - Brand/Info Section */}
          <div className="hidden lg:flex lg:w-1/2 bg-lime-50 dark:bg-lime-950 items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <Image
                    src="/logo.jpg"
                    alt="DENR Logo"
                    width={80}
                    height={80}
                    className="rounded-lg shadow-sm"
                  />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-lime-900 dark:text-lime-100">
                  DENR Chainsaw Registry
                </h1>
                <p className="text-lg text-lime-700 dark:text-lime-300 leading-relaxed">
                  Register your chainsaw for legal use, compliance, and responsible forest management
                </p>
              </div>

              <div className="space-y-4 text-lime-600 dark:text-lime-400">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                  <span className="text-sm font-medium">Secure equipment tracking</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                  <span className="text-sm font-medium">Legal compliance management</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                  <span className="text-sm font-medium">Online registration portal</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                  <span className="text-sm font-medium">Government-approved system</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-lime-200 dark:border-lime-800">
                <p className="text-sm text-lime-600 dark:text-lime-400">
                  For inquiries: cenroalaminos@denr.gov.ph
                </p>
                <p className="text-sm text-lime-600 dark:text-lime-400">
                  Contact: 09852390811
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-slate-950 flex items-center justify-center p-8 relative">
            {/* Back Button */}
            <Link href="/" className="absolute top-6 left-6 z-10">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-lime-600 dark:text-lime-300 hover:text-lime-900 dark:hover:text-lime-100">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-10">
              <ModeToggle />
            </div>

            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AuthLayout;