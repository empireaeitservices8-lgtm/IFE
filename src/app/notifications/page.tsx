
import type { Metadata } from "next";
import Notifications from "@/components/dashboard/Notifications";

export const metadata: Metadata = {
  title: "Notifications | IFE",
  description:
    "View IFE booking updates, payment messages, event reminders and announcements.",
};

export default function NotificationsPage() {
  return <Notifications />;
}
