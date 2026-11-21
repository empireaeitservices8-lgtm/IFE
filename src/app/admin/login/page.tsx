
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Invalid email or password.");
        return;
      }

      const role = json.data?.user?.role;
      if (role !== "ADMIN" && role !== "STAFF") {
        await fetch("/api/auth/logout", { method: "POST" });
        setError("Administrator or staff access is required for this portal.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-white">

      {/* Background Effects */}
      <div className="absolute left-[-150px] top-[-150px] size-[400px] rounded-full bg-[#D4AF6A]/10 blur-[130px]" />
      <div className="absolute bottom-[-150px] right-[-100px] size-[400px] rounded-full bg-[#D4AF6A]/10 blur-[130px]" />

      <div className="relative w-full max-w-md">

        {/* Back to Website */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#D4AF6A]"
        >
          <ArrowLeft size={15} />
          Back to Website
        </Link>

        {/* Login Card */}
        <div className="border border-[#D4AF6A]/20 bg-[#0D0D0D] p-7 shadow-2xl shadow-black/50 sm:p-10">

          {/* Brand */}
          <div className="mb-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 text-[#D4AF6A]">
              <ShieldCheck size={30} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#D4AF6A]">
              IFE Administration
            </p>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl">
              Admin <span className="text-[#D4AF6A]">Login</span>
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Sign in to manage your IFE platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Administrator Email
              </label>

              <div className="flex items-center border border-white/10 bg-black px-4 transition focus-within:border-[#D4AF6A]">
                <Mail size={17} className="text-[#D4AF6A]" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Password
              </label>

              <div className="flex items-center border border-white/10 bg-black px-4 transition focus-within:border-[#D4AF6A]">
                <LockKeyhole size={17} className="text-[#D4AF6A]" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-gray-500 transition hover:text-[#D4AF6A]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  className="accent-[#D4AF6A]"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-[#D4AF6A] transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs leading-6 text-red-400"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-[#D4AF6A] py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Access Dashboard"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-[10px] leading-6 text-gray-600">
              Authorized personnel only.
              <br />
              IFE Administration Portal
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[10px] tracking-widest text-gray-700">
          © {new Date().getFullYear()} IFE INTERNATIONAL FASHION ENTERTAINMENT
        </p>
      </div>
    </main>
  );
}
