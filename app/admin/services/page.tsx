export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AdminServicesClient from "./AdminServicesClient";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return <AdminServicesClient initialServices={services} />;
}
