"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

const REMEMBERED_EMAIL_KEY = "ife_admin_remembered_email";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY));
    } catch {
      return false;
    }
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.user) return;
        const role = json.data.user.role;
        if (role === "ADMIN" || role === "STAFF") {
          window.location.assign("/admin/dashboard");
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError("Please enter your administrator email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
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

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {}

      window.location.assign("/admin/dashboard");
    } catch {
      setError("Unable to reach the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const autofillFix =
    "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#080808] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff] [&:-webkit-autofill]:caret-white";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-[-150px] top-[-150px] size-[420px] rounded-full bg-[#D4AF6A]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] size-[420px] rounded-full bg-[#D4AF6A]/10 blur-[140px]" />

      <div className="relative w-full max-w-md">
        {/* Back to Website */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50 transition hover:text-[#D4AF6A]"
        >
          <FiArrowLeft size={15} />
          Back to Website
        </Link>

        {/* Login Card */}
        <div className="border border-white/10 border-t-2 border-t-[#D4AF6A] bg-[#0B0B0B]/95 p-7 shadow-2xl shadow-black/70 backdrop-blur-xl sm:p-10">
          {/* Brand */}
          <div className="mb-9 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#D4AF6A]/10 text-[#D4AF6A]">
              <FiShield size={28} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF6A]">
              IFE Administration
            </p>

            <h1 className="mt-3 font-[var(--font-playfair)] text-3xl sm:text-4xl">
              Admin <span className="italic text-[#D4AF6A]">Login</span>
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Sign in to manage events, tickets, and bookings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/60"
              >
                Administrator Email
              </label>

              <div className="flex items-center border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                <FiMail size={17} className="shrink-0 text-[#D4AF6A]" />

                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="admin@ife-events.com"
                  className={`w-full bg-transparent px-3.5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 ${autofillFix}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/60"
              >
                Password
              </label>

              <div className="flex items-center border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                <FiLock size={17} className="shrink-0 text-[#D4AF6A]" />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-transparent px-3.5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 ${autofillFix}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 text-white/40 transition hover:text-[#D4AF6A]"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-white/55">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 accent-[#D4AF6A]"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-[#D4AF6A] transition hover:text-[#F5E5B5]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs leading-6 text-red-300"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-[#D4AF6A] py-4 text-xs font-bold uppercase tracking-[0.22em] text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Access Dashboard"}
              <FiArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-[11px] leading-6 text-white/35">
              Authorized personnel only · IFE Administration Portal
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[10px] tracking-[0.2em] text-white/30">
          © {new Date().getFullYear()} IFE INTERNATIONAL FASHION ENTERTAINMENT
        </p>
      </div>
    </main>
  );
}
