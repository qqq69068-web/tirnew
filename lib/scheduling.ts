// Логіка розкладу майстрів
// Майстри 1-5: вантажні (truck, trailer)
// Майстри 6-7: легкові (car)

export const WORKER_IDS_TRUCK = [1, 2, 3, 4, 5];
export const WORKER_IDS_CAR = [6, 7];

export const WORK_START_HOUR = 7;  // 07:00
export const WORK_END_HOUR = 20;   // 20:00

// Парсимо поле hours з послуги: "2-3 год" → 2, "1 год" → 1, "30 хв" → 1
// ВАЖЛИВО: "8-20 год" — це розклад (не тривалість!), повертаємо 1
export function parseServiceHours(hours: string): number {
  if (!hours) return 1;
  const lower = hours.toLowerCase().trim();

  // "30 хв" або "45 хв"
  const minMatch = lower.match(/(\d+)\s*хв/);
  if (minMatch) return 1; // менше години → слот 1 год

  // Діапазон вигляду "A-B год" або "A–B год"
  // Якщо перше число >= 4 і друге > перше → це розклад роботи (напр. "8-20"), не тривалість
  // Тривалість зазвичай: "1-2", "2-3", "3-4" — різниця ≤ 4 год і перше число маленьке
  const rangeMatch = lower.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const a = parseInt(rangeMatch[1]);
    const b = parseInt(rangeMatch[2]);
    const diff = b - a;
    // Якщо різниця > 4 або перше число >= 4 → схоже на розклад, а не тривалість
    if (diff > 4 || a >= 4) return 1;
    // Інакше це тривалість: "1-2 год" → 1, "2-3 год" → 2
    return a;
  }

  // "2 год", "3 год"
  const singleMatch = lower.match(/(\d+)/);
  if (singleMatch) {
    const n = parseInt(singleMatch[1]);
    // Якщо число >= 4 і схоже на годину початку роботи → 1
    if (n >= 4) return 1;
    return n;
  }

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

// Генерує всі слоти на день з кроком slotHours
export function generateDaySlots(date: Date, slotHours: number): Date[] {
  const slots: Date[] = [];
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
  return WORKER_IDS_TRUCK;
}
