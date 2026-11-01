// EXPORTS: useDailyLogs, todayStr
import { useState } from 'react';
import { store } from '@/lib/store';
import type { IDailyLog } from '@/data/types';

const KEY = 'daily_logs';

export function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useDailyLogs() {
  const [logs, setLogs] = useState<IDailyLog[]>(() => store.get(KEY, []));

  const persist = (next: IDailyLog[]) => {
    setLogs(next);
    store.set(KEY, next);
  };

  // 当天打卡（覆盖当天已有记录）
  const checkIn = (outfitId: string, clothesIds: string[]) => {
    const today = todayStr();
    const others = logs.filter((l) => l.date !== today);
    persist([{ date: today, outfitId, clothesIds, createdAt: Date.now() }, ...others]);
  };

  return { logs, checkIn };
}
