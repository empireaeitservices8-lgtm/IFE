
import type { Metadata } from "next";
import Wishlist from "@/components/dashboard/Wishlist";

export const metadata: Metadata = {
  title: "My Wishlist | IFE",
  description:
    "Save your favourite fashion shows and entertainment events with IFE.",
};

export default function WishlistPage() {
  return <Wishlist />;
}
