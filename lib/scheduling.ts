// Логіка розкладу майстрів
// Майстри 1-5: вантажні (truck, trailer)
// Майстри 6-7: легкові (car)

export const WORKER_IDS_TRUCK = [1, 2, 3, 4, 5];
export const WORKER_IDS_CAR = [6, 7];

export const WORK_START_HOUR = 7;  // 07:00
export const WORK_END_HOUR = 20;   // 20:00

// Парсимо поле hours з послуги: "2-3 год" → 2, "1 год" → 1, "30 хв" → 0.5
export function parseServiceHours(hours: string): number {
  if (!hours) return 1;
  const lower = hours.toLowerCase();
  // "30 хв" або "30 min"
  const minMatch = lower.match(/(\d+)\s*хв/);
  if (minMatch) return Math.ceil(parseInt(minMatch[1]) / 60);
  // "1-2 год" → беремо перше число
  const rangeMatch = lower.match(/(\d+)[-–](\d+)/);
  if (rangeMatch) return parseInt(rangeMatch[1]);
  // "2 год"
  const singleMatch = lower.match(/(\d+)/);
  if (singleMatch) return parseInt(singleMatch[1]);
  return 1;
}

// Повертає масив робочих дат на 14 днів вперед (пн-сб)
export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  // Починаємо з завтра
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  let checked = 0;
  while (dates.length < 14 && checked < 30) {
    const d = new Date(start);
    d.setDate(start.getDate() + checked);
    const dow = d.getDay(); // 0=нд, 6=сб
    if (dow !== 0) { // всі дні крім неділі
      dates.push(d);
    }
    checked++;
  }
  return dates;
}

// Генерує всі слоти на день з кроком slotHours
export function generateDaySlots(date: Date, slotHours: number): Date[] {
  const slots: Date[] = [];
  // Нормалізуємо крок: мінімум 1 год
  const step = Math.max(1, slotHours);
  let hour = WORK_START_HOUR;
  while (hour + step <= WORK_END_HOUR) {
    const slot = new Date(date);
    slot.setHours(hour, 0, 0, 0);
    slots.push(slot);
    hour += step;
  }
  return slots;
}

// Перевіряє чи два відрізки часу перетинаються
export function slotsOverlap(
  aStart: Date, aEnd: Date,
  bStart: Date, bEnd: Date
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function getWorkerIds(carCategory: string): number[] {
  if (carCategory === 'car') return WORKER_IDS_CAR;
  return WORKER_IDS_TRUCK; // truck, trailer, або невідомо
}
