import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BodyAvatar from '@/components/BodyAvatar';
import CharacterPicker from '@/pages/TryOnPage/CharacterPicker';
import { useClothes } from '@/hooks/useClothes';
import { useBodyParams } from '@/hooks/useBodyParams';
import { useOutfits } from '@/hooks/useOutfits';
import { useDailyLogs, todayStr } from '@/hooks/useDailyLogs';
import { mockTryOn } from '@/lib/mock-ai';
import { BASE } from '@/lib/base';
import { evaluateFit } from '@/lib/fit-rules';
import { bodyImage } from '@/data/body';
import { MAJOR_LABEL, MAJOR_ORDER } from '@/data/wardrobe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { toast } from 'sonner';
import { CalendarCheck, Check, Save, Sparkles, UserRound, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IClothing, Major } from '@/data/types';

// 预生成的搭配效果图：key = 选中衣物 id 排序后用 | 拼接（与 runTryOn 计算一致）
const TRYON_RESULTS: Record<string, string> = {
  'mock_coat_camel|mock_jeans_blue|mock_tshirt_white': `${BASE}images/tryons/tryon-tshirt-jeans-coat.png`,
  'mock_hoodie_gray|mock_jeans_blue|mock_shoes_white': `${BASE}images/tryons/tryon-hoodie-jeans-shoes.png`,
  'mock_dress_black|mock_shoes_white': `${BASE}images/tryons/tryon-dress-shoes.png`,
};

export default function TryOnPage() {
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('focus');
  const { items } = useClothes();
  const { body, updateBody } = useBodyParams();
  const { saveOutfit: persistOutfit } = useOutfits();
  const { checkIn } = useDailyLogs();

  const [wornMap, setWornMap] = useState<Partial<Record<Major, IClothing[]>>>(() => {
    if (!focusId) return {};
    const item = items.find((i) => i.id === focusId);
    return item ? { [item.category.major]: [item] } : {};
  });
  const [activeMajor, setActiveMajor] = useState<Major>(() => {
    if (!focusId) return 'top';
    return items.find((i) => i.id === focusId)?.category.major ?? 'top';
  });
  const [charOpen, setCharOpen] = useState(false);
  const [tryLoading, setTryLoading] = useState(false);
  const [tryMsg, setTryMsg] = useState('');
  const [tryOverlay, setTryOverlay] = useState('');
  const [outfitName, setOutfitName] = useState('');

  const selectedList = useMemo(
    () => Object.values(wornMap).flat().filter((c): c is IClothing => !!c),
    [wornMap],
  );
  const fit = useMemo(() => evaluateFit(selectedList, body), [selectedList, body]);
  const currentClothes = items.filter((c) => c.category.major === activeMajor);

  const toggleWear = (item: IClothing) => {
    setTryOverlay('');
    const major = item.category.major;
    setWornMap((prev) => {
      const cur = prev[major] ?? [];
      if (major === 'accessory') {
        if (cur.some((c) => c.id === item.id)) {
          return { ...prev, [major]: cur.filter((c) => c.id !== item.id) };
        }
        return { ...prev, [major]: [...cur, item] };
      }
      return { ...prev, [major]: [item] };
    });
  };

  const removeWorn = (item: IClothing) => {
    setTryOverlay('');
    const major = item.category.major;
    setWornMap((prev) => ({ ...prev, [major]: (prev[major] ?? []).filter((c) => c.id !== item.id) }));
  };

  const runTryOn = async () => {
    if (selectedList.length === 0) {
      toast.error('请先选择衣物');
      return;
    }
    setTryLoading(true);
    setTryMsg('');
    setTryOverlay('');
    try {
      const msg = await mockTryOn(selectedList);
      setTryMsg(msg);
      const key = selectedList.map((c) => c.id).sort().join('|');
      const overlay = TRYON_RESULTS[key];
      if (overlay) {
        setTryOverlay(overlay);
        toast.success('试穿效果已生成');
      } else {
        toast.success('试穿效果已生成（该搭配暂无效果图，仅文字提示）');
      }
    } catch (e) {
      toast.error(String(e));
    } finally {
      setTryLoading(false);
    }
  };

  const saveOutfit = () => {
    if (selectedList.length === 0) {
      toast.error('请先选择衣物');
      return;
    }
    const id = `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    persistOutfit({
      id,
      name: outfitName.trim() || `搭配 ${new Date().toLocaleDateString('zh-CN')}`,
      items: selectedList.map((c) => c.id),
      createdAt: Date.now(),
      wearCount: 0,
    });
    toast.success('搭配已保存');
    setOutfitName('');
  };

  const checkInToday = () => {
    if (selectedList.length === 0) {
      toast.error('请先选择衣物');
      return;
    }
    checkIn(todayStr(), selectedList.map((c) => c.id));
    toast.success('今日打卡成功');
  };

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between pt-1">
        <h1 className="text-lg font-semibold">试穿搭配</h1>
        <button
          type="button"
          onClick={() => setCharOpen(true)}
          className="flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-xs font-medium"
        >
          <UserRound className="h-4 w-4" /> 人物形象
        </button>
      </header>

      <BodyAvatar image={bodyImage(body.gender, body.bodyType)} loading={tryLoading} overlay={tryOverlay || undefined} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {MAJOR_ORDER.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setActiveMajor(m)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm',
              activeMajor === m ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground',
            )}
          >
            {MAJOR_LABEL[m]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {currentClothes.map((item) => {
          const selected = (wornMap[activeMajor] ?? []).some((c) => c.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleWear(item)}
              className={cn(
                'relative overflow-hidden rounded-xl border bg-card text-left',
                selected ? 'border-primary ring-2 ring-primary/30' : '',
              )}
            >
              <Image src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
              <span className="block truncate px-1.5 py-1 text-xs">{item.name}</span>
              {selected && (
                <Badge className="absolute right-1 top-1 bg-primary">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      {currentClothes.length === 0 && (
        <p className="text-center text-xs text-muted-foreground">该分类还没有衣物，去「衣橱」添加</p>
      )}

      {selectedList.length > 0 && (
        <section className="rounded-2xl border bg-card p-3">
          <h2 className="mb-2 text-sm font-medium">已选（{selectedList.length}）</h2>
          <div className="flex flex-wrap gap-2">
            {selectedList.map((item) => (
              <span key={item.id} className="flex items-center gap-1 rounded-lg border bg-muted/40 py-0.5 pl-0.5 pr-1">
                <Image src={item.image} alt={item.name} className="h-7 w-7 rounded object-cover" />
                <span className="max-w-16 truncate text-xs">{item.name}</span>
                <button
                  type="button"
                  onClick={() => removeWorn(item)}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted"
                  aria-label="移除"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {selectedList.length > 0 && (
        <section className="rounded-2xl border bg-card p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">适合度</h2>
            <Badge
              variant={fit.verdict === '高' ? 'default' : fit.verdict === '中' ? 'secondary' : 'destructive'}
            >
              {fit.verdict} · {fit.score} 分
            </Badge>
          </div>
          {fit.tips.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {fit.tips.map((t, i) => (
                <li key={i}>· {t}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tryMsg && (
        <p className="rounded-xl border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">{tryMsg}</p>
      )}

      <div className="space-y-2">
        <Button className="w-full" onClick={runTryOn} disabled={tryLoading}>
          <Sparkles className="mr-1 h-4 w-4" /> {tryLoading ? '生成中…' : 'AI 试穿'}
        </Button>
        <div className="flex gap-2">
          <Input
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            placeholder="搭配名称（可选）"
            className="flex-1"
          />
          <Button variant="outline" onClick={saveOutfit}>
            <Save className="mr-1 h-4 w-4" /> 保存
          </Button>
        </div>
        <Button variant="secondary" className="w-full" onClick={checkInToday}>
          <CalendarCheck className="mr-1 h-4 w-4" /> 今日打卡
        </Button>
      </div>

      <CharacterPicker body={body} onSave={updateBody} open={charOpen} onOpenChange={setCharOpen} />
    </div>
  );
}
