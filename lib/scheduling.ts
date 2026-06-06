// Логіка розкладу майстрів
// Майстри 1-5: вантажні (truck, trailer)
// Майстри 6-7: легкові (car)

export const WORKER_IDS_TRUCK = [1, 2, 3, 4, 5];
export const WORKER_IDS_CAR = [6, 7];

export const WORK_START_HOUR = 7;  // 07:00
export const WORK_END_HOUR = 20;   // 20:00
const WORK_DAY_HOURS = WORK_END_HOUR - WORK_START_HOUR; // 13 год

/**
 * Парсимо рядок hours з послуги → повертаємо тривалість у годинах.
 *
 * Правила:
 *  "30 хв"     → 1
 *  "1 год"     → 1
 *  "2-3 год"   → середнє = 2.5 → ceil = 3
 *  "3-4 год"   → середнє = 3.5 → ceil = 4
 *  "8-20 год"  → середнє = 14 → блокує весь день
 */
export function parseServiceHours(hours: string): number {
  if (!hours) return 1;
  const lower = hours.toLowerCase().trim();

  // "30 хв" / "45 хв"
  const minMatch = lower.match(/(\d+)\s*хв/);
  if (minMatch) return 1;

  // Діапазон "A-B" або "A–B" — це завжди діапазон тривалості, беремо середнє
  const rangeMatch = lower.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const a = parseInt(rangeMatch[1]);
    const b = parseInt(rangeMatch[2]);
    return Math.ceil((a + b) / 2);
  }

  // "Тільки одне число: "2 год"
  const singleMatch = lower.match(/(\d+)/);
  if (singleMatch) return Math.max(1, parseInt(singleMatch[1]));

  return 1;
}

// Повертає масив робочих дат на 14 днів вперед (пн-сб)
export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  let checked = 0;
  while (dates.length < 14 && checked < 30) {
    const d = new Date(start);
    d.setDate(start.getDate() + checked);
    const dow = d.getDay();
    if (dow !== 0) {
      dates.push(d);
    }
    checked++;
  }
  return dates;
}

/**
 * Генерує слоти на день.
 * Якщо slotHours >= WORK_DAY_HOURS — повертаємо лише 1 слот (07:00), що блокує весь день.
 */
export function generateDaySlots(date: Date, slotHours: number): Date[] {
  const slots: Date[] = [];
  const step = Math.max(1, slotHours);

  // Якщо послуга займає весь день (або більше) — тільки 1 слот
  if (step >= WORK_DAY_HOURS) {
    const slot = new Date(date);
    slot.setHours(WORK_START_HOUR, 0, 0, 0);
    return [slot];
  }

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
  return WORKER_IDS_TRUCK;
}
