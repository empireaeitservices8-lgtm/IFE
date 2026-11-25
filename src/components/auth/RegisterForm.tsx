"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.fullName.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
      setMessage("Please enter a valid mobile number.");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setMessage(json.message || "Registration failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 600);
    } catch {
      setMessage("Unable to connect to registration server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600";

  const fieldClass =
    "flex items-center gap-2.5 rounded-lg border border-white/15 bg-[#080808] px-3.5 transition focus-within:border-[#D4AF6A]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-5 text-white sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#252016,#080808_70%)] p-9 lg:flex">
          <div className="absolute -right-28 -top-20 h-80 w-80 rounded-full border border-[#D4AF6A]/20" />
          <div className="absolute -right-16 -top-8 h-60 w-60 rounded-full border border-[#D4AF6A]/20" />

          <div className="relative z-10">
            <p className="text-sm font-semibold tracking-[0.4em] text-[#D4AF6A]">
              IFE
            </p>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.25em] text-gray-400">
              International Fashion Entertainment
            </p>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#D4AF6A]">
              Join the IFE community
            </p>

            <h1 className="font-[var(--font-playfair)] text-4xl leading-tight">
              Your next
              <span className="block italic text-[#D4AF6A]">
                extraordinary
              </span>
              experience starts here.
            </h1>

            <p className="mt-4 max-w-sm text-xs leading-6 text-gray-400 sm:text-sm">
              Create your account and discover fashion, entertainment and
              exclusive events.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Discover exclusive events",
                "Manage your bookings",
                "Access your digital tickets",
                "Stay updated with IFE",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <FiCheckCircle size={16} className="shrink-0 text-[#D4AF6A]" />
                  <span className="text-xs text-gray-300 sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-[11px] tracking-wider text-gray-500">
            EXPERIENCE MORE. EXPECT EXTRAORDINARY.
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-6 py-7 sm:px-10">
          <div className="w-full max-w-lg">
            <div className="mb-5">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                Create Your Account
              </p>

              <h2 className="font-[var(--font-playfair)] text-3xl">Register</h2>

              <p className="mt-1.5 text-xs leading-5 text-gray-400 sm:text-sm">
                Enter your details to join the IFE community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs text-gray-300"
                  >
                    Full Name
                  </label>

                  <div className={fieldClass}>
                    <FiUser size={16} className="shrink-0 text-[#D4AF6A]" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs text-gray-300"
                  >
                    Mobile Number
                  </label>

                  <div className={fieldClass}>
                    <FiPhone size={16} className="shrink-0 text-[#D4AF6A]" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="Enter mobile number"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs text-gray-300"
                >
                  Email Address
                </label>

                <div className={fieldClass}>
                  <FiMail size={16} className="shrink-0 text-[#D4AF6A]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs text-gray-300"
                  >
                    Password
                  </label>

                  <div className={fieldClass}>
                    <FiLock size={16} className="shrink-0 text-[#D4AF6A]" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Min 8 chars"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="shrink-0 text-gray-500 hover:text-[#D4AF6A]"
                    >
                      {showPassword ? (
                        <FiEyeOff size={17} />
                      ) : (
                        <FiEye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs text-gray-300"
                  >
                    Confirm Password
                  </label>

                  <div className={fieldClass}>
                    <FiLock size={16} className="shrink-0 text-[#D4AF6A]" />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
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
                      className="shrink-0 text-gray-500 hover:text-[#D4AF6A]"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={17} />
                      ) : (
                        <FiEye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-xs text-gray-400">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#D4AF6A]"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#D4AF6A] text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <FiArrowRight size={16} />
              </button>

              {message && (
                <p
                  role="status"
                  className={`rounded-lg border p-2.5 text-xs leading-5 ${
                    success
                      ? "border-green-500/30 bg-green-500/5 text-green-300"
                      : "border-red-500/30 bg-red-500/5 text-red-300"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#D4AF6A] hover:text-[#F5E5B5]"
                >
                  Sign In
                </Link>
              </p>

              <Link href="/" className="text-gray-500 hover:text-[#D4AF6A]">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
