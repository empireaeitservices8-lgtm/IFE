
import type { Metadata } from "next";
import MyTickets from "@/components/dashboard/MyTickets";

export const metadata: Metadata = {
  title: "My Tickets | IFE",
  description:
    "View your IFE event tickets, attendee information and ticket references.",
};

export default function MyTicketsPage() {
  return <MyTickets />;
}
