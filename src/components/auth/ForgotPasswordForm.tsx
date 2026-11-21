
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Unable to process password reset request.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-16 text-white sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] lg:grid-cols-2">

        {/* Editorial Panel */}
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#252016,#080808_70%)] p-12 lg:flex">
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
              Account Recovery
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Every great
              <span className="block italic text-[#D4AF6A]">
                experience
              </span>
              starts again.
            </h1>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              Recover access to your IFE account and continue
              discovering exclusive fashion and entertainment
              experiences.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-wider text-gray-500">
            EXPERIENCE MORE. EXPECT EXTRAORDINARY.
          </p>
        </div>

        {/* Recovery Form */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">

            {!submitted ? (
              <>
                <div className="mb-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
                    <KeyRound size={25} className="text-[#D4AF6A]" />
                  </div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                    Password Assistance
                  </p>

                  <h2 className="font-serif text-4xl">
                    Forgot Password?
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    Enter the email address associated with your
                    account. We&apos;ll use it to initiate the password
                    recovery process.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm text-gray-300"
                    >
                      Registered Email Address
                    </label>

                    <div className="flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]">
                      <Mail size={19} className="text-[#D4AF6A]" />

                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                      />
                    </div>
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
                    Request Reset Link
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
                  Request Submitted
                </p>

                <h2 className="font-serif text-4xl">
                  Check Your Email
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-400">
                  Your password recovery request has been
                  validated in this demo.
                </p>

                <p className="mt-4 break-all text-sm font-medium text-[#D4AF6A]">
                  {email}
                </p>

                <div className="mt-7 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-left text-sm leading-6 text-amber-300">
                  Demo mode: No reset email has actually been sent.
                  Email delivery will be enabled through the backend.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="mt-7 text-sm text-gray-400 transition hover:text-[#D4AF6A]"
                >
                  Try another email
                </button>
              </div>
            )}

            <div className="mt-10 border-t border-white/10 pt-7">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF6A]"
              >
                <ArrowLeft size={17} />
                Back to Sign In
              </Link>

              <Link
                href="/"
                className="mt-6 block text-center text-xs text-gray-600 transition hover:text-[#D4AF6A]"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
