import Link from "next/link";
import { FiArrowRight, FiCheck, FiX } from "react-icons/fi";

type PaymentStatusProps = {
  status: "success" | "failed";
  eventId: string;
  eventTitle: string;
  paymentId?: string;
  orderId?: string;
};

export default function PaymentStatus({
  status,
  eventId,
  eventTitle,
  paymentId,
  orderId,
}: PaymentStatusProps) {
  const isSuccess = status === "success";

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#050505] px-5 py-8 text-white md:px-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Status Icon */}
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
            isSuccess
              ? "border-[#D4AF6A] bg-[#D4AF6A]/10 text-[#D4AF6A]"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {isSuccess ? <FiCheck size={26} /> : <FiX size={26} />}
        </div>

        {/* Status Heading */}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
          {isSuccess ? "Payment Completed" : "Payment Unsuccessful"}
        </p>

        <h1 className="font-[var(--font-playfair)] text-3xl leading-tight md:text-4xl">
          {isSuccess ? (
            <>
              Thank You for <span className="text-[#D4AF6A]">Booking!</span>
            </>
          ) : (
            <>
              Payment <span className="text-red-400">Failed</span>
            </>
          )}
        </h1>

        <p className="mt-3 max-w-lg text-xs leading-6 text-white/60 md:text-sm">
          {isSuccess
            ? "Your payment has been received and your booking is confirmed. View your confirmation or digital pass below."
            : "We couldn't complete your payment. Please return to checkout and try again."}
        </p>

        {/* Event Details */}
        <div className="mt-6 w-full border border-white/10 bg-[#111111] p-5 text-left md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                Event Information
              </p>
              <h2 className="mt-1 font-[var(--font-playfair)] text-xl md:text-2xl">
                {eventTitle}
              </h2>
            </div>

            <span
              className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                isSuccess
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {isSuccess ? "Confirmed" : "Failed"}
            </span>
          </div>

          <div className="mt-2 divide-y divide-white/10 text-xs md:text-sm">
            {orderId && (
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <span className="text-white/45">Order ID</span>
                <span className="break-all font-mono text-white/85">
                  {orderId}
                </span>
              </div>
            )}

            {paymentId && (
              <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
                <span className="text-white/45">Payment ID</span>
                <span className="break-all font-mono text-white/85">
                  {paymentId}
                </span>
              </div>
            )}

            <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row">
              <span className="text-white/45">Payment Status</span>
              <span
                className={`font-semibold ${
                  isSuccess ? "text-[#D4AF6A]" : "text-red-400"
                }`}
              >
                {isSuccess ? "Paid & Verified" : "Unsuccessful"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {isSuccess ? (
            <Link
              href={`/events/${eventId}/booking-confirmation`}
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
            >
              View Booking Confirmation
              <FiArrowRight size={15} />
            </Link>
          ) : (
            <Link
              href={`/events/${eventId}/checkout`}
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#F5E5B5]"
            >
              Return to Checkout
              <FiArrowRight size={15} />
            </Link>
          )}

          <Link
            href="/events"
            className="inline-flex items-center justify-center border border-white/20 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            Explore Events
          </Link>
        </div>

        {/* Support */}
        <p className="mt-5 text-xs text-white/40">
          Need assistance?{" "}
          <Link
            href="/contact"
            className="text-[#D4AF6A] underline underline-offset-4"
          >
            Contact our support team
          </Link>
        </p>
      </div>
    </section>
  );
}
