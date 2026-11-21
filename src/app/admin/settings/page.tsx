
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  User,
  Building2,
  Ticket,
  Bell,
  CreditCard,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Percent,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Section =
  | "Platform"
  | "Admin Profile"
  | "Booking"
  | "Notifications"
  | "Payments";

const sections: { name: Section; icon: typeof Settings; description: string }[] = [
  { name: "Platform", icon: Building2, description: "Website and company information" },
  { name: "Admin Profile", icon: User, description: "Administrator account details" },
  { name: "Booking", icon: Ticket, description: "Ticket and booking preferences" },
  { name: "Notifications", icon: Bell, description: "Email and notification preferences" },
  { name: "Payments", icon: CreditCard, description: "Payment gateway configuration" },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF6A]/60"
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#D4AF6A]" : "bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("Platform");
  const [savedMessage, setSavedMessage] = useState("");

  const [platform, setPlatform] = useState({
    name: "International Fashion Entertainment",
    shortName: "IFE",
    email: "info@ife-events.com",
    phone: "+91 98765 43210",
    website: "https://ife-events.com",
    address: "Kochi, Kerala, India",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  const [admin, setAdmin] = useState({
    name: "IFE Administrator",
    email: "admin@ife-events.com",
    phone: "",
    role: "ADMIN",
  });

  useEffect(() => {
    fetch("/api/customers/profile")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.profile) {
          const p = json.data.profile;
          setAdmin({
            name: p.name || "",
            email: p.email || "",
            phone: p.phone || "",
            role: p.role || "ADMIN",
          });
        }
      })
      .catch(() => {});
  }, []);

  const [booking, setBooking] = useState({
    tax: "18",
    serviceFee: "2",
    minTickets: "1",
    maxTickets: "10",
    cancellation: true,
    guestCheckout: true,
    bookingConfirmation: true,
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    paymentSuccess: true,
    paymentFailed: true,
    refundUpdates: true,
    eventReminders: true,
    marketingEmails: false,
    recipient: "admin@ife-events.com",
  });

  const [payments, setPayments] = useState({
    gateway: "Razorpay",
    keyId: "",
    keySecret: "",
    environment: "Test",
    enabled: false,
    upi: true,
    cards: true,
    netBanking: true,
    wallets: true,
  });

  async function saveSettings() {
    if (activeSection === "Admin Profile") {
      try {
        const res = await fetch("/api/customers/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: admin.name,
            phone: admin.phone || null,
          }),
        });
        const json = await res.json();
        setSavedMessage(
          res.ok && json.success
            ? "Admin profile saved to database."
            : json.message || "Failed to update admin profile."
        );
      } catch {
        setSavedMessage("Network error while saving admin profile.");
      }
      window.setTimeout(() => setSavedMessage(""), 4000);
      return;
    }

    setSavedMessage(
      `${activeSection} preferences are managed via server environment configuration.`
    );
    window.setTimeout(() => setSavedMessage(""), 4000);
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-[#0d0d0d] lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-7 py-7">
          <Link href="/admin/dashboard" className="text-2xl font-semibold tracking-[0.2em] text-[#D4AF6A]">
            IFE
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gray-500">Admin workspace</p>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6 text-sm">
          {[
            ["Dashboard", "/admin/dashboard"],
            ["Events", "/admin/events"],
            ["Tickets", "/admin/tickets"],
            ["Bookings", "/admin/bookings"],
            ["Customers", "/admin/customers"],
            ["Payments", "/admin/payments"],
            ["Artists", "/admin/artists"],
            ["Venues", "/admin/venues"],
            ["Gallery", "/admin/gallery"],
            ["Settings", "/admin/settings"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-4 py-3 transition ${
                label === "Settings"
                  ? "border border-[#D4AF6A]/20 bg-[#D4AF6A]/10 text-[#D4AF6A]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-gray-500">IFE Management Portal</p>
          <p className="mt-1 text-xs text-[#D4AF6A]">Demo administrator</p>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#080808]/95 px-5 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs text-gray-500">Admin / Configuration</p>
            <h1 className="mt-1 text-xl font-semibold md:text-2xl">Settings</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 sm:flex">
            <ShieldCheck size={15} className="text-[#D4AF6A]" />
            Administrator settings
          </div>
        </header>

        <div className="space-y-7 p-5 md:p-8">
          <div>
            <p className="text-sm text-gray-400">
              Configure your IFE platform, booking preferences and integrations.
            </p>
            <p className="mt-1 text-xs text-gray-600">
              These settings are currently stored only in the browser session.
            </p>
          </div>

          {savedMessage && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              {savedMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-xl border border-white/10 bg-[#111] p-3">
              <p className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                Settings menu
              </p>
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.name}
                    onClick={() => {
                      setActiveSection(section.name);
                      setSavedMessage("");
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition ${
                      activeSection === section.name
                        ? "bg-[#D4AF6A]/10 text-[#D4AF6A]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <section.icon size={18} className="mt-0.5 shrink-0" />
                    <span>
                      <span className="block text-sm font-medium">{section.name}</span>
                      <span className="mt-1 block text-[10px] leading-4 text-gray-600">
                        {section.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-xl border border-white/10 bg-[#111] p-5 md:p-7">
              {activeSection === "Platform" && (
                <>
                  <SectionHeading
                    title="Platform Information"
                    description="Manage the basic identity and contact information of your IFE platform."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Platform Name" value={platform.name} onChange={(value) => setPlatform({ ...platform, name: value })} />
                    <Field label="Short Name" value={platform.shortName} onChange={(value) => setPlatform({ ...platform, shortName: value })} />
                    <Field label="Contact Email" type="email" value={platform.email} onChange={(value) => setPlatform({ ...platform, email: value })} />
                    <Field label="Contact Phone" value={platform.phone} onChange={(value) => setPlatform({ ...platform, phone: value })} />
                    <Field label="Website URL" value={platform.website} onChange={(value) => setPlatform({ ...platform, website: value })} />
                    <Field label="Business Address" value={platform.address} onChange={(value) => setPlatform({ ...platform, address: value })} />
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-xs text-gray-400">Default Currency</span>
                      <select
                        value={platform.currency}
                        onChange={(event) => setPlatform({ ...platform, currency: event.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-[#D4AF6A]/60"
                      >
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="AED">AED - UAE Dirham</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-2 block text-xs text-gray-400">Timezone</span>
                      <select
                        value={platform.timezone}
                        onChange={(event) => setPlatform({ ...platform, timezone: event.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-[#D4AF6A]/60"
                      >
                        <option value="Asia/Kolkata">India Standard Time</option>
                        <option value="Asia/Dubai">Gulf Standard Time</option>
                        <option value="Europe/London">London</option>
                        <option value="America/New_York">Eastern Time</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {activeSection === "Admin Profile" && (
                <>
                  <SectionHeading
                    title="Administrator Profile"
                    description="Manage the contact information displayed for the current administrator."
                  />

                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-white/10 bg-[#090909] p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF6A]/10 text-xl font-semibold text-[#D4AF6A]">
                      IA
                    </div>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{admin.role}</p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Full Name" value={admin.name} onChange={(value) => setAdmin({ ...admin, name: value })} />
                    <Field label="Email Address" type="email" value={admin.email} onChange={(value) => setAdmin({ ...admin, email: value })} />
                    <Field label="Phone Number" value={admin.phone} onChange={(value) => setAdmin({ ...admin, phone: value })} />
                    <Field label="Role" value={admin.role} onChange={(value) => setAdmin({ ...admin, role: value })} />
                  </div>

                  <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex gap-2 text-sm text-amber-400">
                      <AlertCircle size={17} />
                      Authentication is not connected
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Changing these profile fields does not change your actual login credentials.
                      Secure password management and role permissions need backend authentication.
                    </p>
                  </div>
                </>
              )}

              {activeSection === "Booking" && (
                <>
                  <SectionHeading
                    title="Booking Preferences"
                    description="Set default ticket limits, tax and booking behaviour."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Tax Rate (%)" type="number" value={booking.tax} onChange={(value) => setBooking({ ...booking, tax: value })} />
                    <Field label="Service Fee (%)" type="number" value={booking.serviceFee} onChange={(value) => setBooking({ ...booking, serviceFee: value })} />
                    <Field label="Minimum Tickets per Booking" type="number" value={booking.minTickets} onChange={(value) => setBooking({ ...booking, minTickets: value })} />
                    <Field label="Maximum Tickets per Booking" type="number" value={booking.maxTickets} onChange={(value) => setBooking({ ...booking, maxTickets: value })} />
                  </div>

                  <div className="mt-7">
                    <h3 className="mb-2 text-sm font-semibold">Booking options</h3>
                    <Toggle
                      label="Allow booking cancellation"
                      description="Display cancellation options to customers."
                      checked={booking.cancellation}
                      onChange={(value) => setBooking({ ...booking, cancellation: value })}
                    />
                    <Toggle
                      label="Allow guest checkout"
                      description="Allow customers to book tickets without creating an account."
                      checked={booking.guestCheckout}
                      onChange={(value) => setBooking({ ...booking, guestCheckout: value })}
                    />
                    <Toggle
                      label="Booking confirmation"
                      description="Enable the booking confirmation preference for new bookings."
                      checked={booking.bookingConfirmation}
                      onChange={(value) => setBooking({ ...booking, bookingConfirmation: value })}
                    />
                  </div>

                  <div className="mt-5 rounded-lg border border-white/10 bg-[#090909] p-4">
                    <p className="text-xs text-gray-500">Example tax calculation</p>
                    <p className="mt-2 text-lg font-semibold text-[#D4AF6A]">
                      ₹1,000 + ₹{(Number(booking.tax) || 0) * 10} tax
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Illustrative calculation only. Confirm the applicable tax rules before using this setting in production.
                    </p>
                  </div>
                </>
              )}

              {activeSection === "Notifications" && (
                <>
                  <SectionHeading
                    title="Notification Preferences"
                    description="Choose which platform events should generate administrator notifications."
                  />

                  <Field
                    label="Notification Recipient Email"
                    type="email"
                    value={notifications.recipient}
                    onChange={(value) => setNotifications({ ...notifications, recipient: value })}
                  />

                  <div className="mt-7">
                    <h3 className="mb-2 text-sm font-semibold">Email notification events</h3>
                    <Toggle
                      label="New booking"
                      description="Notify the admin when a customer creates a booking."
                      checked={notifications.newBooking}
                      onChange={(value) => setNotifications({ ...notifications, newBooking: value })}
                    />
                    <Toggle
                      label="Successful payment"
                      description="Notify the admin when a payment is confirmed."
                      checked={notifications.paymentSuccess}
                      onChange={(value) => setNotifications({ ...notifications, paymentSuccess: value })}
                    />
                    <Toggle
                      label="Failed payment"
                      description="Notify the admin when a payment attempt fails."
                      checked={notifications.paymentFailed}
                      onChange={(value) => setNotifications({ ...notifications, paymentFailed: value })}
                    />
                    <Toggle
                      label="Refund updates"
                      description="Notify the admin when a refund status changes."
                      checked={notifications.refundUpdates}
                      onChange={(value) => setNotifications({ ...notifications, refundUpdates: value })}
                    />
                    <Toggle
                      label="Event reminders"
                      description="Enable reminders for upcoming events."
                      checked={notifications.eventReminders}
                      onChange={(value) => setNotifications({ ...notifications, eventReminders: value })}
                    />
                    <Toggle
                      label="Marketing emails"
                      description="Enable promotional email preferences."
                      checked={notifications.marketingEmails}
                      onChange={(value) => setNotifications({ ...notifications, marketingEmails: value })}
                    />
                  </div>

                  <div className="mt-5 rounded-lg border border-white/10 bg-[#090909] p-4">
                    <p className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail size={16} className="text-[#D4AF6A]" />
                      Email service integration required
                    </p>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      These switches store interface preferences only. Actual email delivery requires
                      an email provider, server-side templates and event-triggered backend logic.
                    </p>
                  </div>
                </>
              )}

              {activeSection === "Payments" && (
                <>
                  <SectionHeading
                    title="Payment Configuration"
                    description="Configure the payment gateway preferences for the IFE booking platform."
                  />

                  <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                      <AlertCircle size={17} />
                      Gateway is not connected
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Do not enter live credentials into this demo page. Production payment integration
                      must keep secret keys on the server and verify gateway signatures securely.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-xs text-gray-400">Payment Gateway</span>
                      <select
                        value={payments.gateway}
                        onChange={(event) => setPayments({ ...payments, gateway: event.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-[#D4AF6A]/60"
                      >
                        <option>Razorpay</option>
                        <option>Stripe</option>
                        <option>PayU</option>
                      </select>
                    </label>

                    <label>
                      <span className="mb-2 block text-xs text-gray-400">Environment</span>
                      <select
                        value={payments.environment}
                        onChange={(event) => setPayments({ ...payments, environment: event.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-[#D4AF6A]/60"
                      >
                        <option>Test</option>
                        <option>Live</option>
                      </select>
                    </label>

                    <Field
                      label="Public Key ID (demo field)"
                      value={payments.keyId}
                      onChange={(value) => setPayments({ ...payments, keyId: value })}
                      placeholder="Enter test key ID"
                    />
                    <Field
                      label="Secret Key"
                      type="password"
                      value={payments.keySecret}
                      onChange={(value) => setPayments({ ...payments, keySecret: value })}
                      placeholder="Do not enter a real secret here"
                    />
                  </div>

                  <div className="mt-7">
                    <h3 className="mb-2 text-sm font-semibold">Payment methods</h3>
                    <Toggle
                      label="Enable Razorpay checkout"
                      description="Demo preference for enabling the selected gateway."
                      checked={payments.enabled}
                      onChange={(value) => setPayments({ ...payments, enabled: value })}
                    />
                    <Toggle
                      label="UPI"
                      description="Allow UPI as a checkout method."
                      checked={payments.upi}
                      onChange={(value) => setPayments({ ...payments, upi: value })}
                    />
                    <Toggle
                      label="Credit and debit cards"
                      description="Allow card payments through the gateway."
                      checked={payments.cards}
                      onChange={(value) => setPayments({ ...payments, cards: value })}
                    />
                    <Toggle
                      label="Net banking"
                      description="Allow supported net banking methods."
                      checked={payments.netBanking}
                      onChange={(value) => setPayments({ ...payments, netBanking: value })}
                    />
                    <Toggle
                      label="Wallets"
                      description="Allow supported wallet payment methods."
                      checked={payments.wallets}
                      onChange={(value) => setPayments({ ...payments, wallets: value })}
                    />
                  </div>
                </>
              )}

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                <p className="text-xs text-gray-600">
                  Changes are local demo state and will reset when the page reloads.
                </p>
                <button
                  onClick={saveSettings}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c27e]"
                >
                  <Save size={16} />
                  Save {activeSection} Settings
                </button>
              </div>
            </section>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Globe, label: "Platform", value: platform.shortName || "IFE" },
              { icon: IndianRupee, label: "Currency", value: platform.currency },
              { icon: Clock, label: "Timezone", value: platform.timezone },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] p-4">
                <div className="rounded-lg bg-[#D4AF6A]/10 p-3 text-[#D4AF6A]">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
