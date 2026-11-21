
import Link from "next/link";

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
    <section className="min-h-[85vh] bg-[#050505] px-5 py-20 text-white md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

        {/* Status Icon */}
        <div
          className={`mb-8 flex h-24 w-24 items-center justify-center rounded-full border ${
            isSuccess
              ? "border-[#D4AF6A] bg-[#D4AF6A]/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          {isSuccess ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 w-12 text-[#D4AF6A]"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                d="M5 12.5L10 17L20 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 w-12 text-red-400"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                d="M7 7L17 17M17 7L7 17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Status Heading */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF6A]">
          {isSuccess ? "Payment Completed" : "Payment Unsuccessful"}
        </p>

        <h1 className="font-serif text-4xl leading-tight md:text-6xl">
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

        <p className="mt-6 max-w-xl text-sm leading-8 text-white/50 md:text-base">
          {isSuccess
            ? "Your payment status has been marked as successful in this demonstration. Your booking will be confirmed after server-side payment verification."
            : "We couldn't complete your payment in this demonstration. You can return to checkout and try again once payment processing is enabled."}
        </p>

        {/* Event Details */}
        <div className="mt-12 w-full border border-white/10 bg-[#111111] p-7 text-left md:p-9">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF6A]">
            Event Information
          </p>

          <h2 className="mt-4 font-serif text-2xl md:text-3xl">
            {eventTitle}
          </h2>

          <div className="my-7 border-t border-white/10" />

          {orderId && (
            <div className="flex flex-col justify-between gap-2 border-b border-white/10 py-4 sm:flex-row">
              <span className="text-sm text-white/40">Order ID</span>
              <span className="break-all text-sm">{orderId}</span>
            </div>
          )}

          {paymentId && (
            <div className="flex flex-col justify-between gap-2 border-b border-white/10 py-4 sm:flex-row">
              <span className="text-sm text-white/40">Payment ID</span>
              <span className="break-all text-sm">{paymentId}</span>
            </div>
          )}

          <div className="flex flex-col justify-between gap-2 py-4 sm:flex-row">
            <span className="text-sm text-white/40">Payment Status</span>
            <span
              className={`text-sm font-semibold ${
                isSuccess ? "text-[#D4AF6A]" : "text-red-400"
              }`}
            >
              {isSuccess ? "Successful (Demo)" : "Failed (Demo)"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          {isSuccess ? (
            <Link
              href={`/events/${eventId}/booking-confirmation`}
              className="bg-[#D4AF6A] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
            >
              View Booking Confirmation →
            </Link>
          ) : (
            <Link
              href={`/events/${eventId}/checkout`}
              className="bg-[#D4AF6A] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5]"
            >
              Return to Checkout →
            </Link>
          )}

          <Link
            href="/events"
            className="border border-white/20 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
          >
            Explore Events
          </Link>
        </div>

        {/* Support */}
        <p className="mt-12 text-sm text-white/35">
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
