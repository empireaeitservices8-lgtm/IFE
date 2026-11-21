
import type { Metadata } from "next";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | IFE",
  description:
    "Manage your personal information and contact details on IFE.",
};

export default function ProfilePage() {
  return <ProfileForm />;
}
