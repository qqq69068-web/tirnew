export const dynamic = "force-dynamic";

import { getTokenPayload } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const payload = await getTokenPayload();

  if (!payload) {
    return <>{children}</>;
  }

  return <AdminShell email={payload.email ?? ""}>{children}</AdminShell>;
}
