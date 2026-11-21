
import type { Metadata } from "next";
import MyBookings from "@/components/dashboard/MyBookings";

export const metadata: Metadata = {
  title: "My Bookings | IFE",
  description:
    "View your IFE event booking details, ticket information and booking references.",
};

export default function MyBookingsPage() {
  return <MyBookings />;
}
