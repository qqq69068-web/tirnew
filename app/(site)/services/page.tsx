import ServicesClient from "./ServicesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const allServices = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return <ServicesClient initialServices={allServices} />;
}
