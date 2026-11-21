
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    "h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600";

  const fieldClass =
    "flex items-center gap-3 border border-white/15 bg-[#080808] px-4 transition focus-within:border-[#D4AF6A]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-14 text-white sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] lg:grid-cols-2">

        {/* Left Panel */}
        <div className="relative hidden min-h-[800px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#252016,#080808_70%)] p-12 lg:flex">
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
              Join the IFE community
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Your next
              <span className="block italic text-[#D4AF6A]">
                extraordinary
              </span>
              experience starts here.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Create your account and discover fashion,
              entertainment and exclusive events.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover exclusive events",
                "Manage your bookings",
                "Access your digital tickets",
                "Stay updated with IFE",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-[#D4AF6A]"
                  />
                  <span className="text-sm text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wider text-gray-500">
            EXPERIENCE MORE. EXPECT EXTRAORDINARY.
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF6A]">
                Create Your Account
              </p>

              <h2 className="font-serif text-4xl">
                Register
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Enter your details to join the IFE community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Full Name
                </label>

                <div className={fieldClass}>
                  <User size={18} className="text-[#D4AF6A]" />
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

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Email Address
                </label>

                <div className={fieldClass}>
                  <Mail size={18} className="text-[#D4AF6A]" />
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Mobile Number
                </label>

                <div className={fieldClass}>
                  <Phone size={18} className="text-[#D4AF6A]" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Enter your mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Password
                </label>

                <div className={fieldClass}>
                  <LockKeyhole
                    size={18}
                    className="text-[#D4AF6A]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
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
                  Confirm Password
                </label>

                <div className={fieldClass}>
                  <LockKeyhole
                    size={18}
                    className="text-[#D4AF6A]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
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

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-400">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-[#D4AF6A]"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#D4AF6A] hover:text-[#F5E5B5]"
                  >
                    Privacy Policy
                  </Link>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-3 bg-[#D4AF6A] text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#F5E5B5]"
              >
                Create Account
                <ArrowRight size={18} />
              </button>

              {message && (
                <p
                  role="status"
                  className={`rounded-lg border p-3 text-sm leading-6 ${
                    success
                      ? "border-green-500/30 bg-green-500/5 text-green-300"
                      : "border-red-500/30 bg-red-500/5 text-red-300"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#D4AF6A] hover:text-[#F5E5B5]"
              >
                Sign In
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-sm text-gray-500 hover:text-[#D4AF6A]"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
