"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  if (subscribed) {
    return (
      <div className="flex w-full items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-xs text-emerald-200 sm:text-sm">
        <FiCheckCircle size={17} className="shrink-0 text-emerald-400" />
        <span>
          Thank you for subscribing! You&apos;ll receive updates on upcoming IFE
          showcases.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        aria-label="Email address"
        required
        className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF6A]"
      />

      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[2px] text-black transition hover:bg-[#F5E5B5]"
      >
        Subscribe
      </button>
    </form>
  );
}
