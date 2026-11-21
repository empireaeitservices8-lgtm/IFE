
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Include at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Include at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Include at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("token") || ""
        : "";

    if (!token) {
      setError("Missing password reset token in URL.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to reset password.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error while resetting password.");
    }
  };

  const inputClass =
    "h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600";

  const fieldClass =
    "flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-16 text-white sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] lg:grid-cols-2">

        {/* Left Editorial Panel */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#252016,#080808_70%)] p-12 lg:flex">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-[#D4AF6A]/20" />
          <div className="absolute -right-12 -top-8 h-64 w-64 rounded-full border border-[#D4AF6A]/20" />

          <div className="relative z-10">
            <p className="text-sm font-semibold tracking-[0.4em] text-[#D4AF6A]">
              IFE
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-400">
              International Fashion Entertainment
            </p>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#D4AF6A]">
              Account Security
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Secure your
              <span className="block italic text-[#D4AF6A]">
                account.
              </span>
              Continue your journey.
            </h1>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              Create a strong password to protect your
              bookings, personal details and exclusive
              IFE experiences.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-wider text-gray-500">
            EXPERIENCE MORE. EXPECT EXTRAORDINARY.
          </p>
        </div>

        {/* Reset Form */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">

            {!success ? (
              <>
                <div className="mb-9">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
                    <ShieldCheck
                      size={25}
                      className="text-[#D4AF6A]"
                    />
                  </div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                    Password Recovery
                  </p>

                  <h2 className="font-serif text-4xl">
                    Reset Password
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    Enter your new password below to update
                    your account credentials.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm text-gray-300"
                    >
                      New Password
                    </label>

                    <div className={fieldClass}>
                      <LockKeyhole
                        size={19}
                        className="text-[#D4AF6A]"
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="text-gray-500 hover:text-[#D4AF6A]"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm text-gray-300"
                    >
                      Confirm New Password
                    </label>

                    <div className={fieldClass}>
                      <LockKeyhole
                        size={19}
                        className="text-[#D4AF6A]"
                      />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        autoComplete="new-password"
                        required
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="text-gray-500 hover:text-[#D4AF6A]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="rounded-lg border border-white/10 bg-[#080808] p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Password Requirements
                    </p>

                    <ul className="space-y-2 text-xs text-gray-500">
                      <li className={password.length >= 8 ? "text-[#D4AF6A]" : ""}>
                        • At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(password) ? "text-[#D4AF6A]" : ""}>
                        • One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(password) ? "text-[#D4AF6A]" : ""}>
                        • One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(password) ? "text-[#D4AF6A]" : ""}>
                        • One number
                      </li>
                    </ul>
                  </div>

                  {error && (
                    <p role="alert" className="text-sm text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center gap-3 bg-[#D4AF6A] text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
                  >
                    Update Password
                    <ArrowRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
                  <CheckCircle2
                    size={42}
                    className="text-[#D4AF6A]"
                  />
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                  Demo Complete
                </p>

                <h2 className="font-serif text-4xl">
                  Password Validated
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-400">
                  Your new password passed the frontend
                  validation checks.
                </p>

                <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-left text-sm leading-6 text-amber-300">
                  Demo mode: Your actual account password
                  has not been changed. Backend token
                  verification and password updating are
                  not connected yet.
                </div>

                <Link
                  href="/login"
                  className="mt-8 flex h-14 w-full items-center justify-center gap-3 bg-[#D4AF6A] text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
                >
                  Continue to Login
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}

            <div className="mt-9 border-t border-white/10 pt-7">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF6A]"
              >
                <ArrowLeft size={17} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
