import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [bookingsCount, newBookings, messagesCount, newMessages, clientsCount] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "new" } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "new" } }),
      prisma.client.count(),
    ]);

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Замовлень", value: bookingsCount, badge: newBookings, badgeLabel: "нових" },
    { label: "Повідомлень", value: messagesCount, badge: newMessages, badgeLabel: "нових" },
    { label: "Клієнтів", value: clientsCount, badge: null, badgeLabel: "" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Дашборд</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{s.value}</span>
              {s.badge !== null && s.badge > 0 && (
                <span className="mb-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  {s.badge} {s.badgeLabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">Останні замовлення</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {recentBookings.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400">Замовлень поки немає</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Ім'я", "Телефон", "Послуга", "Статус", "Дата"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{b.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.phone}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{b.service || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.status === "new" ? "bg-amber-100 text-amber-700" :
                      b.status === "done" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {b.status === "new" ? "Новий" : b.status === "done" ? "Виконано" : b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(b.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
