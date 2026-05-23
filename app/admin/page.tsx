import { getTokenPayload } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardPage() {
  const payload = await getTokenPayload();
  if (!payload) redirect("/admin/login");

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Адмін-панель</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{payload.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Записи на сервіс
          <span className="ml-2 text-sm font-normal text-gray-500">({bookings.length})</span>
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Записів поки немає</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Ім'я", "Телефон", "Авто", "Послуга", "Дата", "Статус", "Створено"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${b.phone}`} className="text-blue-600 hover:underline">{b.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.carBrand && b.carModel ? `${b.carBrand} ${b.carModel}` : b.carBrand || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.service || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.date ? new Date(b.date).toLocaleDateString("uk-UA") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === "new"
                          ? "bg-amber-100 text-amber-700"
                          : b.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {b.status === "new" ? "Новий" : b.status === "done" ? "Виконано" : b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(b.createdAt).toLocaleString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
