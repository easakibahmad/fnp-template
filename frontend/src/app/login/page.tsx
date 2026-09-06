import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login/LoginForm";
import { getCurrentUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/auth";

export const metadata = {
  title: "Sign in",
  description: "Sign in to FNP Template.",
};

export default async function LoginPage() {
  const existing = await getCurrentUser();
  if (existing) {
    redirect(isAdmin(existing) ? "/admin/access" : "/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        <div className="flex flex-col items-center gap-3 justify-center mb-2">
          <div className="h-12 w-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xl font-bold shadow-lg">
            C
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            FNP Template
          </span>
        </div>

        {/* Real login — backend auth */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-8 relative overflow-hidden">
          {/* Decorative subtle gradient border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-2 text-center">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Sign in to your account to continue
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
