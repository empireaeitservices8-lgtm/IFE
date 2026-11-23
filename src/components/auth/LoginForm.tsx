
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getRedirectTarget = () => {
    if (typeof window === "undefined") return "/dashboard";
    const param = new URLSearchParams(window.location.search).get("redirect");
    if (param && param.startsWith("/") && !param.startsWith("//")) {
      return param;
    }
    return "/dashboard";
  };

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.user) return;
        window.location.assign(getRedirectTarget());
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setMessage("Please enter both your email address and password.");
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
        setMessage(json.message || "Invalid email or password.");
        return;
      }
      window.location.assign(getRedirectTarget());
    } catch {
      setMessage("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-16 text-white sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] lg:grid-cols-2">

        {/* Left Editorial Panel */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#252016,#080808_70%)] p-12 lg:flex">
          <div className="absolute -right-28 -top-20 h-96 w-96 rounded-full border border-[#D4AF6A]/20" />
          <div className="absolute -right-16 -top-8 h-72 w-72 rounded-full border border-[#D4AF6A]/20" />

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
              Your world of experiences
            </p>
            <h1 className="font-serif text-5xl leading-tight">
              Be part of
              <span className="block italic text-[#D4AF6A]">
                extraordinary
              </span>
              moments.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Discover exclusive fashion shows, entertainment
              experiences and unforgettable events with IFE.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-wider text-gray-500">
            EXPERIENCE MORE. EXPECT EXTRAORDINARY.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                Welcome Back
              </p>
              <h2 className="font-serif text-4xl">Sign In</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Sign in to manage your event bookings and tickets.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                  <FiMail size={18} className="text-[#D4AF6A]" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (message) setMessage("");
                    }}
                    className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm text-gray-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#D4AF6A] transition hover:text-[#F5E5B5]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                  <FiLock size={18} className="text-[#D4AF6A]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (message) setMessage("");
                    }}
                    className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="text-gray-500 transition hover:text-[#D4AF6A]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={19} />
                    ) : (
                      <FiEye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 bg-[#D4AF6A] text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
                <FiArrowRight size={18} />
              </button>

              {message && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm leading-6 text-red-300"
                >
                  {message}
                </p>
              )}
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-wider text-gray-600">
                New to IFE?
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              href="/register"
              className="flex h-14 w-full items-center justify-center border border-[#D4AF6A]/50 text-sm font-semibold text-[#D4AF6A] transition hover:bg-[#D4AF6A]/10"
            >
              Create an Account
            </Link>

            <p className="mt-8 text-center text-xs leading-6 text-gray-500">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-gray-300 hover:text-[#D4AF6A]"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-gray-300 hover:text-[#D4AF6A]"
              >
                Privacy Policy
              </Link>.
            </p>

            <Link
              href="/"
              className="mt-8 block text-center text-sm text-gray-500 transition hover:text-[#D4AF6A]"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
