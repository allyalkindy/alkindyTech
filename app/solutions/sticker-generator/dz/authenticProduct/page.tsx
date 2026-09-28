import type { Metadata } from "next";
import { AuthenticProductExperience } from "@/components/solutions/dz/authentic-product";

export const metadata: Metadata = {
  title: { absolute: "Authentic Product — DZ" },
  description: "This product has been verified as an authentic, genuine DZ original.",
  robots: { index: false, follow: false },
};

export default function AuthenticProductPage() {
  return <AuthenticProductExperience />;
}
