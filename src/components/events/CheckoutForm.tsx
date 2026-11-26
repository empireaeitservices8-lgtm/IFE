
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  serializeTicketSelection,
  type SelectedTicketItem,
} from "@/lib/events/ticket-selection";

type CheckoutFormProps = {
  eventId: string;
  eventTitle: string;
  selectedItems: SelectedTicketItem[];
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

export default function CheckoutForm({
  eventId,
  eventTitle,
  selectedItems,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(true);

  const totalQuantity = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const selectionQuery = serializeTicketSelection(selectedItems);

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

    return () => {
      active = false;
    };
  }, []);

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

      if (apiTickets.length === 0) {
        setMessage("No active ticket types available for this event.");
        return;
      }

      const itemTotals = new Map<string, number>();
      for (const selected of selectedItems) {
        const matched =
          apiTickets.find(
            (t) =>
              t.name.toLowerCase() === selected.name.toLowerCase() ||
              t.name.toLowerCase().includes(selected.id.toLowerCase())
          ) || apiTickets[0];
        itemTotals.set(
          matched.id,
          (itemTotals.get(matched.id) || 0) + selected.quantity
        );
      }

      const bookingItems = Array.from(itemTotals.entries()).map(
        ([ticketTypeId, quantity]) => ({ ticketTypeId, quantity })
      );

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventJson.data.event.id,
          customerName: billing.fullName.trim(),
          customerEmail: billing.email.trim(),
          customerPhone: billing.phone.trim(),
          items: bookingItems,
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
      if (orderData.mode === "sandbox") {
        router.push(
          `/events/${eventId}/payment-success?bookingCode=${encodeURIComponent(bookingCode)}&paymentId=${encodeURIComponent(orderData.paymentId || "")}&orderId=${encodeURIComponent(orderData.orderId || "")}`
        );
        return;
      }

      const RazorpayCtor = (
        window as unknown as {
          Razorpay?: new (opts: Record<string, unknown>) => {
            open: () => void;
            on?: (
              event: string,
              cb: (resp: { error?: { description?: string } }) => void
            ) => void;
          };
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
          Razorpay: new (opts: Record<string, unknown>) => {
            open: () => void;
            on?: (
              event: string,
              cb: (resp: { error?: { description?: string } }) => void
            ) => void;
          };
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
            setProcessing(false);
            setMessage(
              `Payment window closed. Your booking (${bookingCode}) is reserved—you can retry payment.`
            );
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setProcessing(true);
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
                `/events/${eventId}/payment-success?bookingCode=${encodeURIComponent(bookingCode)}&paymentId=${encodeURIComponent(response.razorpay_payment_id)}&orderId=${encodeURIComponent(response.razorpay_order_id)}`
              );
            } else {
              router.push(
                `/events/${eventId}/payment-failed?bookingCode=${encodeURIComponent(bookingCode)}`
              );
            }
          } catch {
            router.push(
              `/events/${eventId}/payment-failed?bookingCode=${encodeURIComponent(bookingCode)}`
            );
          } finally {
            setProcessing(false);
          }
        },
      });
      rzp.on?.("payment.failed", (resp) => {
        setProcessing(false);
        setMessage(
          resp?.error?.description ||
            `Payment failed. Your booking (${bookingCode}) is reserved—please try again.`
        );
      });
      rzp.open();
    } catch {
      setMessage("Unable to process checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#050505] px-5 py-6 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb + Heading */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
              <Link href="/events" className="hover:text-[#D4AF6A]">
                Events
              </Link>
              <span>/</span>
              <Link
                href={`/events/${eventId}/booking-summary?${selectionQuery}`}
                className="hover:text-[#D4AF6A]"
              >
                Booking Summary
              </Link>
              <span>/</span>
              <span className="text-[#D4AF6A]">Checkout</span>
            </div>

            <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl">
              Secure <span className="text-[#D4AF6A]">Checkout</span>
            </h1>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Step 04 / Payment
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Checkout Form */}
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Billing Details */}
            <div className="border border-white/10 bg-[#111111] p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-[var(--font-playfair)] text-xl">
                  Billing Information
                </h2>
                <span className="text-[11px] uppercase tracking-wider text-[#D4AF6A]">
                  {isGuest ? "Guest Checkout" : "Member Account"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="billing-name"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="billing-email"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="billing-phone"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="billing-address"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
                  >
                    Street Address *
                  </label>
                  <input
                    id="billing-address"
                    type="text"
                    required
                    maxLength={300}
                    autoComplete="street-address"
                    value={billing.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    placeholder="Enter your billing address"
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="billing-city"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="billing-state"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label
                    htmlFor="billing-pincode"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60"
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
                    placeholder="6-digit PIN"
                    className="w-full border border-white/10 bg-[#080808] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-white/25 focus:border-[#D4AF6A]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method & Terms */}
            <div className="border border-white/10 bg-[#111111] p-5 md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-[var(--font-playfair)] text-lg">
                  Payment Method
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF6A]">
                  Encrypted &amp; Secure
                </span>
              </div>

              <label className="flex cursor-pointer items-center gap-3 border border-[#D4AF6A]/60 bg-[#D4AF6A]/[0.05] p-3.5">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#D4AF6A]"
                />

                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Razorpay Secure Payment
                    </p>
                    <p className="text-xs text-white/50">
                      UPI, Credit/Debit Cards, Net Banking &amp; Wallets
                    </p>
                  </div>
                  <span className="border border-[#D4AF6A]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D4AF6A]">
                    Preferred
                  </span>
                </div>
              </label>

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-xs text-white/60">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#D4AF6A]"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#D4AF6A] underline"
                  >
                    Terms &amp; Conditions
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
                className="border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 p-3.5 text-xs leading-6 text-[#F5E5B5]"
              >
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 pt-1 sm:flex-row sm:items-center">
              <Link
                href={`/events/${eventId}/booking-summary?${selectionQuery}`}
                className="text-xs text-white/45 transition hover:text-[#D4AF6A]"
              >
                ← Back to Booking Summary
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="bg-[#D4AF6A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Processing..." : `Pay ${formatPrice(total)} →`}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <aside className="h-fit border border-white/10 bg-[#111111] p-6 lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF6A]">
              Your Order
            </p>

            <h2 className="mt-2 font-[var(--font-playfair)] text-xl leading-snug">
              {eventTitle}
            </h2>

            <div className="my-4 border-t border-white/10" />

            <div className="space-y-3 text-sm">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <span className="text-white/60">
                    {item.quantity} × {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
                <span className="text-white/50">Checkout Mode</span>
                <span className="text-right text-[#D4AF6A]">
                  {isGuest ? "Guest Checkout" : "Member Account"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">Total Passes</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/60">Total Payable</span>
              <span className="text-2xl font-semibold text-[#D4AF6A]">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={processing}
              className="mt-5 w-full bg-[#D4AF6A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? "Processing..." : `Pay ${formatPrice(total)} →`}
            </button>

            <p className="mt-3 text-center text-[11px] text-white/40">
              Instant digital pass with QR code issued upon payment.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
