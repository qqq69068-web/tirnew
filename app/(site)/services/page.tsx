import ServicesClient from "./ServicesClient";
import { services } from "@/lib/services";

export const dynamic = "force-static";

export default function ServicesPage() {
  return <ServicesClient initialServices={services} />;
}
