
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CreditCard,
  Ticket,
  Megaphone,
  CheckCheck,
  Trash2,
  ArrowRight,
  CircleAlert,
  Check,
  MailOpen,
} from "lucide-react";

type NotificationCategory =
  | "Booking"
  | "Payment"
  | "Event"
  | "Announcement";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  time: string;
  read: boolean;
  href: string;
};

type ApiNotification = {
  id: string;
  subject: string;
  message: string;
  type: "BOOKING" | "PAYMENT" | "EVENT" | "ACCOUNT" | "SYSTEM";
  status: string;
  createdAt: string;
};

function mapNotificationCategory(
  type: ApiNotification["type"]
): NotificationCategory {
  switch (type) {
    case "BOOKING":
      return "Booking";
    case "PAYMENT":
      return "Payment";
    case "EVENT":
      return "Event";
    default:
      return "Announcement";
  }
}

const filters = [
  "All",
  "Booking",
  "Payment",
  "Event",
  "Announcement",
] as const;

function CategoryIcon({ category }: { category: NotificationCategory }) {
  const iconClass = "text-[#D4AF6A]";

  switch (category) {
    case "Booking":
      return <Ticket size={19} className={iconClass} />;
    case "Payment":
      return <CreditCard size={19} className={iconClass} />;
    case "Event":
      return <CalendarDays size={19} className={iconClass} />;
    case "Announcement":
      return <Megaphone size={19} className={iconClass} />;
    default:
      return <Bell size={19} className={iconClass} />;
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((json) => {
        if (!active || !json.success) return;
        const mapped: NotificationItem[] = (json.data.items || []).map(
          (n: ApiNotification) => ({
            id: n.id,
            title: n.subject,
            message: n.message,
            category: mapNotificationCategory(n.type),
            time: new Date(n.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            read: n.status === "READ",
            href: "/my-bookings",
          })
        );
        setNotifications(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesCategory =
        activeFilter === "All" ||
        notification.category === activeFilter;

      const matchesReadStatus =
        !showUnreadOnly || !notification.read;

      return matchesCategory && matchesReadStatus;
    });
  }, [notifications, activeFilter, showUnreadOnly]);

  const markAsRead = async (id: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" }).catch(
      () => {}
    );
  };

  const markAllAsRead = async () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
    await fetch("/api/notifications/read-all", { method: "PATCH" }).catch(
      () => {}
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF6A]">
              Customer Account
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl">
              Notifications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
              Stay updated with booking information, payment messages,
              upcoming events and IFE announcements.
            </p>
          </div>

          <div className="flex items-center gap-3 border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] px-5 py-4">
            <Bell size={21} className="text-[#D4AF6A]" />
            <div>
              <p className="text-2xl font-semibold text-white">
                {unreadCount.toString().padStart(2, "0")}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Unread
              </p>
            </div>
          </div>
        </div>

        {/* Demo notice */}
        <div className="mb-8 flex gap-3 border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] p-4">
          <CircleAlert
            size={19}
            className="mt-0.5 shrink-0 text-[#D4AF6A]"
          />
          <div>
            <p className="text-sm font-semibold text-[#F5E5B5]">
              Sample notifications
            </p>
            <p className="mt-1 text-xs leading-6 text-gray-400">
              These notifications are demonstration content. They are
              not generated by real bookings, payments, emails or event
              reminder services. Changes are temporary browser state.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-[#101010] p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Notifications
            </p>
            <p className="mt-3 font-serif text-3xl">
              {notifications.length.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="border border-white/10 bg-[#101010] p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Unread Messages
            </p>
            <p className="mt-3 font-serif text-3xl text-[#D4AF6A]">
              {unreadCount.toString().padStart(2, "0")}
            </p>
          </div>

          <div className="border border-white/10 bg-[#101010] p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Read Messages
            </p>
            <p className="mt-3 font-serif text-3xl">
              {(notifications.length - unreadCount)
                .toString()
                .padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Filters and actions */}
        <div className="mb-6 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  activeFilter === filter
                    ? "border-[#D4AF6A] bg-[#D4AF6A] text-black"
                    : "border-white/10 text-gray-400 hover:border-[#D4AF6A] hover:text-[#D4AF6A]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-400">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(event) =>
                  setShowUnreadOnly(event.target.checked)
                }
                className="size-4 accent-[#D4AF6A]"
              />
              Unread only
            </label>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF6A] transition hover:text-[#F5E5B5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`border p-5 transition sm:p-6 ${
                notification.read
                  ? "border-white/10 bg-[#101010]"
                  : "border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.045]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
                  <CategoryIcon category={notification.category} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-white">
                      {notification.title}
                    </h2>

                    {!notification.read && (
                      <span className="size-2 rounded-full bg-[#D4AF6A]" />
                    )}

                    <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-gray-500">
                      {notification.category}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-gray-400">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-wider text-gray-600">
                    {notification.time}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={notification.href}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF6A] transition hover:text-[#F5E5B5]"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>

                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
                      >
                        <MailOpen size={14} />
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                      aria-label={`Delete ${notification.title}`}
                      className="inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-red-400"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                {notification.read && (
                  <div
                    className="hidden shrink-0 text-gray-600 sm:block"
                    title="Read"
                  >
                    <Check size={17} />
                  </div>
                )}
              </div>
            </article>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="border border-white/10 bg-[#101010] px-5 py-16 text-center">
              <Bell size={35} className="mx-auto text-gray-600" />

              <h3 className="mt-5 font-serif text-2xl text-white">
                No notifications found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are no notifications matching your selected filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setShowUnreadOnly(false);
                }}
                className="mt-6 border border-[#D4AF6A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#D4AF6A] transition hover:bg-[#D4AF6A] hover:text-black"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 transition hover:text-[#D4AF6A]"
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF6A] transition hover:text-[#F5E5B5]"
          >
            Explore Events
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
