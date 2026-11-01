import { useClothes } from '@/hooks/useClothes';
import { useDailyLogs, todayStr } from '@/hooks/useDailyLogs';
import { useOutfits } from '@/hooks/useOutfits';
import { useBodyParams } from '@/hooks/useBodyParams';
import { evaluateFit } from '@/lib/fit-rules';
import { MAJOR_LABEL } from '@/data/wardrobe';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { CalendarCheck, TrendingUp } from 'lucide-react';

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function OutfitLogPage() {
  const { items, getById } = useClothes();
  const { logs } = useDailyLogs();
  const { outfits } = useOutfits();
  const { body } = useBodyParams();

  const today = todayStr();
  const todayLog = logs.find((l) => l.date === today);

  // 衣物实穿次数
  const wearCount: Record<string, number> = {};
  logs.forEach((l) => l.clothesIds.forEach((id) => (wearCount[id] = (wearCount[id] ?? 0) + 1)));
  const topClothes = Object.entries(wearCount)
    .map(([id, n]) => ({ item: getById(id), n }))
    .filter((x) => x.item)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  const topOutfits = [...outfits].sort((a, b) => b.wearCount - a.wearCount).slice(0, 3);

  // 近 7 天打卡量
  const days = Array.from({ length: 7 }, (_, i) => {
    const ds = dateNDaysAgo(6 - i);
    const log = logs.find((l) => l.date === ds);
    return { date: ds, count: log ? log.clothesIds.length : 0, label: `${6 - i + 1}` };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  // 偏好推荐：高频衣物中适合度高的
  const recommended = topClothes
    .filter((x) => x.item)
    .map((x) => ({ item: x.item!, n: x.n, fit: evaluateFit([x.item!], body).score }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 3);

  return (
    <div className="space-y-5 p-4">
      <header className="pt-1">
        <h1 className="text-lg font-semibold">穿搭记录</h1>
      </header>

      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-2 text-primary">
          <CalendarCheck className="h-5 w-5" />
          <h2 className="font-medium">今日打卡</h2>
        </div>
        {todayLog ? (
          <div className="mt-3 space-y-1.5">
            <p className="text-sm text-muted-foreground">今天已记录 {todayLog.clothesIds.length} 件衣物</p>
            <div className="flex flex-wrap gap-1.5">
              {todayLog.clothesIds.map((id) => {
                const it = getById(id);
                return it ? (
                  <Badge key={id} variant="secondary">{it.name}</Badge>
                ) : null;
              })}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">今天还没打卡，去「试穿」搭配一套并记录吧</p>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          <h2 className="font-medium">近 7 天打卡量</h2>
        </div>
        <div className="mt-3 flex h-28 items-end gap-2">
          {days.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d.count || ''}</span>
              <div
                className="w-full rounded-t-md bg-primary/70"
                style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? 6 : 2 }}
              />
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <h2 className="font-medium">你的高频单品</h2>
        {topClothes.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">还没有实穿记录，搭配并打卡后这里会统计</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {topClothes.map(({ item, n }) => (
              <li key={item!.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Image src={item!.image} alt={item!.name} className="h-8 w-8 rounded object-cover" />
                  <span>{item!.name}</span>
                </span>
                <Badge variant="outline">穿 {n} 次</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <h2 className="font-medium">高频搭配</h2>
        {topOutfits.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">还没有保存的搭配</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {topOutfits.map((o) => (
              <li key={o.id} className="flex items-center justify-between text-sm">
                <span>{o.name}</span>
                <Badge variant="outline">穿过 {o.wearCount} 次</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <h2 className="font-medium">适合你的推荐</h2>
        {recommended.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">积累实穿记录后，这里会结合你的体型推荐</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recommended.map(({ item, n, fit }) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Image src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                  <span>{item.name} · {MAJOR_LABEL[item.category.major]}</span>
                </span>
                <Badge>适合度 {fit}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
