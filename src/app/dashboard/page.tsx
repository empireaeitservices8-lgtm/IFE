
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export const metadata = {
  title: "Customer Dashboard | IFE",
  description:
    "Manage your IFE event bookings, tickets and customer profile.",
};

export default function DashboardPage() {
  return <CustomerDashboard />;
}
