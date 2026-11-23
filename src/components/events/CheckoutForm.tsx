
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  eventId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
};

type BillingDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const ticketOptions: Record<
  string,
  { name: string; price: number }
> = {
  single: { name: "Single Entry", price: 1499 },
  couple: { name: "Couple Entry", price: 2699 },
  group5: { name: "Group of 5", price: 6999 },
  vip: { name: "VIP Pass", price: 3499 },
};

export default function CheckoutForm({
  eventId,
  eventTitle,
  ticketType,
  quantity,
}: CheckoutFormProps) {
  const router = useRouter();
  const fallbackTicket = ticketOptions[ticketType] || ticketOptions.single;
  const [liveTicket, setLiveTicket] = useState<{ name: string; price: number }>(
    fallbackTicket
  );
  const [isGuest, setIsGuest] = useState(true);

  const subtotal = liveTicket.price * quantity;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const [billing, setBilling] = useState<BillingDetails>(() => {
    const base: BillingDetails = {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };
    if (typeof window === "undefined") return base;
    try {
      const storedAttendees = sessionStorage.getItem(
        `ife-attendees-${eventId}`
      );
      if (storedAttendees) {
        const parsed = JSON.parse(storedAttendees) as {
          fullName?: string;
          email?: string;
          phone?: string;
        }[];
        const primary = Array.isArray(parsed) ? parsed[0] : null;
        if (primary) {
          base.fullName = primary.fullName || "";
          base.email = primary.email || "";
          base.phone = primary.phone || "";
        }
      }
    } catch {}
    return base;
  });

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.user) return;
        setIsGuest(false);
        const u = json.data.user;
        setBilling((prev) => ({
          ...prev,
          fullName: prev.fullName || u.name || "",
          email: prev.email || u.email || "",
          phone: prev.phone || u.phone || "",
        }));
      })
      .catch(() => {});

    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success || !json.data?.event?.ticketTypes) return;
        const apiTickets: { name: string; price: string | number }[] =
          json.data.event.ticketTypes;
        const targetName = (ticketOptions[ticketType]?.name || ticketType).toLowerCase();
        const matched = apiTickets.find(
          (t) =>
            t.name.toLowerCase() === targetName ||
            t.name.toLowerCase().includes(ticketType.toLowerCase())
        );
        if (matched) {
          setLiveTicket({ name: matched.name, price: Number(matched.price) });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [eventId, ticketType]);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const updateField = (
    field: keyof BillingDetails,
    value: string
  ) => {
    setBilling((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!acceptedTerms) {
      setMessage("Please accept the terms and conditions to continue.");
      return;
    }

    const phoneValid = /^[0-9+\-\s()]{7,15}$/.test(billing.phone);
    const pincodeValid = /^[0-9]{6}$/.test(billing.pincode);

    if (!phoneValid || !pincodeValid) {
      setMessage("Please check your mobile number and 6-digit PIN code.");
      return;
    }

    try {
      setProcessing(true);
      sessionStorage.setItem(
        `ife-billing-${eventId}`,
        JSON.stringify(billing)
      );
      sessionStorage.setItem(
        `ife-payment-preference-${eventId}`,
        paymentMethod
      );

      const eventRes = await fetch(`/api/events/${eventId}`);
      const eventJson = await eventRes.json();
      if (!eventRes.ok || !eventJson.success) {
        setMessage(eventJson.message || "Unable to load event ticket details.");
        return;
      }

      const apiTickets: { id: string; name: string }[] =
        eventJson.data.event?.ticketTypes || [];
      const matchedTicket =
        apiTickets.find((t) =>
          t.name.toLowerCase().includes(ticketType.toLowerCase())
        ) || apiTickets[0];

      if (!matchedTicket) {
        setMessage("No active ticket types available for this event.");
        return;
      }

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventJson.data.event.id,
          customerName: billing.fullName.trim(),
          customerEmail: billing.email.trim(),
          customerPhone: billing.phone.trim(),
          items: [{ ticketTypeId: matchedTicket.id, quantity }],
        }),
      });
      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok || !bookingJson.success) {
        setMessage(bookingJson.message || "Could not create booking.");
        return;
      }

      const bookingId = bookingJson.data.booking.id;
      const bookingCode = bookingJson.data.booking.bookingCode;

      sessionStorage.setItem(
        `ife-booking-${eventId}`,
        JSON.stringify({ bookingId, bookingCode })
      );

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.success) {
        setMessage(
          `${orderJson.message || "Payment gateway is not configured yet."} Your booking (${bookingCode}) was saved.`
        );
        return;
      }

      const orderData = orderJson.data;
      const RazorpayCtor = (
        window as unknown as {
          Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
        }
      ).Razorpay;

      if (!RazorpayCtor) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay SDK load failed"));
          document.body.appendChild(script);
        });
      }

      const Rzp = (
        window as unknown as {
          Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
        }
      ).Razorpay;

      const rzp = new Rzp({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IFE Events",
        description: orderData.eventTitle,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        modal: {
          ondismiss: () => {
            setMessage(
              `Payment window closed. Your guest booking (${bookingCode}) is reserved—you can retry payment.`
            );
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            router.push(
              `/events/${eventId}/payment-success?bookingCode=${encodeURIComponent(bookingCode)}`
            );
          } else {
            router.push(
              `/events/${eventId}/payment-failed?bookingCode=${encodeURIComponent(bookingCode)}`
            );
          }
        },
      });
      rzp.open();
    } catch {
      setMessage("Unable to process checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] px-5 py-16 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-white/40">
          <Link href="/events" className="hover:text-[#D4AF6A]">
            Events
          </Link>
          <span>/</span>
          <Link
            href={`/events/${eventId}/booking-summary?ticket=${ticketType}&quantity=${quantity}`}
            className="hover:text-[#D4AF6A]"
          >
            Booking Summary
          </Link>
          <span>/</span>
          <span className="text-[#D4AF6A]">Checkout</span>
        </div>

        {/* Heading */}
        <div className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
            Complete Your Booking
          </p>

          <h1 className="font-serif text-4xl md:text-6xl">
            Secure <span className="text-[#D4AF6A]">Checkout</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Enter your billing information and review your
            payment preference before completing your booking.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Billing Details */}
            <div className="border border-white/10 bg-[#111111] p-7 md:p-9">
              <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
                    Step 01
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">
                    Billing Information
                  </h2>
                </div>
                <span className="text-xs text-white/30">
                  Required
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">

                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="billing-name"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    Full Name *
                  </label>
                  <input
                    id="billing-name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={billing.fullName}
                    onChange={(e) =>
                      updateField("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="billing-email"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    Email Address *
                  </label>
                  <input
                    id="billing-email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={billing.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="billing-phone"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="billing-phone"
                    type="tel"
                    required
                    maxLength={15}
                    autoComplete="tel"
                    value={billing.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="billing-address"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    Address *
                  </label>
                  <textarea
                    id="billing-address"
                    required
                    maxLength={300}
                    rows={3}
                    autoComplete="street-address"
                    value={billing.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    placeholder="Enter your billing address"
                    className="w-full resize-none border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="billing-city"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    City *
                  </label>
                  <input
                    id="billing-city"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                    value={billing.city}
                    onChange={(e) =>
                      updateField("city", e.target.value)
                    }
                    placeholder="Enter city"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="billing-state"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    State *
                  </label>
                  <input
                    id="billing-state"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="address-level1"
                    value={billing.state}
                    onChange={(e) =>
                      updateField("state", e.target.value)
                    }
                    placeholder="Enter state"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label
                    htmlFor="billing-pincode"
                    className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/60"
                  >
                    PIN Code *
                  </label>
                  <input
                    id="billing-pincode"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    autoComplete="postal-code"
                    value={billing.pincode}
                    onChange={(e) =>
                      updateField("pincode", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="6-digit PIN code"
                    className="w-full border border-white/10 bg-[#080808] px-5 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-white/10 bg-[#111111] p-7 md:p-9">
              <div className="mb-8 border-b border-white/10 pb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF6A]">
                  Step 02
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  Payment Method
                </h2>
              </div>

              <label className="flex cursor-pointer items-start gap-4 border border-[#D4AF6A] bg-[#D4AF6A]/[0.05] p-5">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 accent-[#D4AF6A]"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold">
                      Razorpay Secure Payment
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF6A]">
                      Preferred
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Pay using UPI, debit card, credit card,
                    net banking, or other supported methods
                    through Razorpay.
                  </p>
                </div>
              </label>

              <p className="mt-5 text-xs leading-6 text-white/35">
                You will be redirected to the payment gateway
                when the payment integration is enabled.
                This demonstration does not collect card or UPI details.
              </p>
            </div>

            {/* Terms */}
            <div className="border border-white/10 bg-[#111111] p-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  className="mt-1 accent-[#D4AF6A]"
                />

                <span className="text-sm leading-7 text-white/55">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#D4AF6A] underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-[#D4AF6A] underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {message && (
              <div
                role="status"
                className="border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 p-5 text-sm leading-7 text-[#F5E5B5]"
              >
                {message}
              </div>
            )}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <Link
                href={`/events/${eventId}/booking-summary?ticket=${ticketType}&quantity=${quantity}`}
                className="text-sm text-white/45 transition hover:text-[#D4AF6A]"
              >
                ← Back to Booking Summary
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="bg-[#D4AF6A] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Processing..." : "Proceed to Payment →"}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-7 lg:sticky lg:top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF6A]">
              Your Order
            </p>

            <h2 className="mt-5 font-serif text-2xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-7 border-t border-white/10" />

            <div className="space-y-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/45">Ticket Type</span>
                <span className="text-right">{liveTicket.name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/45">Checkout Mode</span>
                <span className="text-right text-[#D4AF6A]">
                  {isGuest ? "Guest Checkout" : "Member Account"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Quantity</span>
                <span>{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/45">Estimated Tax (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="my-7 border-t border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/50">
                Total Amount
              </span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-8 border border-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF6A]">
                Secure Checkout
              </p>
              <p className="mt-3 text-xs leading-6 text-white/40">
                Payment processing will be handled by the
                integrated payment gateway once configured.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
