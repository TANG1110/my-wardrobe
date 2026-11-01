import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClothes } from '@/hooks/useClothes';
import { MAJOR_LABEL, MAJOR_ORDER, MINOR_BY_MAJOR } from '@/data/wardrobe';
import ClothingCard from '@/components/ClothingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Fit, Major } from '@/data/types';

const FITS: { value: 'all' | Fit; label: string }[] = [
  { value: 'all', label: '全部版型' },
  { value: 'slim', label: '修身' },
  { value: 'regular', label: '合身' },
  { value: 'loose', label: '宽松' },
];

export default function WardrobePage() {
  const { items, deleteClothing } = useClothes();
  const navigate = useNavigate();
  const [major, setMajor] = useState<'all' | Major>('all');
  const [minor, setMinor] = useState('all');
  const [fit, setFit] = useState<'all' | Fit>('all');
  const [q, setQ] = useState('');
  const [delId, setDelId] = useState<string | null>(null);

  const tabs: ('all' | Major)[] = ['all', ...MAJOR_ORDER];
  const minorOptions = major === 'all' ? Object.values(MINOR_BY_MAJOR).flat() : MINOR_BY_MAJOR[major];

  const filtered = items.filter((i) => {
    if (major !== 'all' && i.category.major !== major) return false;
    if (minor !== 'all' && i.category.minor !== minor) return false;
    if (fit !== 'all' && i.category.fit !== fit) return false;
    if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const toDelete = delId ? items.find((i) => i.id === delId) : undefined;

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-semibold">我的衣橱</h1>
        <Button size="sm" onClick={() => navigate('/add-clothing')}>
          <Plus className="mr-1 h-4 w-4" /> 添加
        </Button>
      </header>

      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索衣物"
              className="pl-8"
            />
          </div>
          <Select value={fit} onValueChange={(v) => setFit(v as 'all' | Fit)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FITS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setMajor(t);
                setMinor('all');
              }}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm',
                major === t ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground',
              )}
            >
              {t === 'all' ? '全部' : MAJOR_LABEL[t]}
            </button>
          ))}
        </div>

        <Select value={minor} onValueChange={setMinor}>
          <SelectTrigger className="w-full"><SelectValue placeholder="小类" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部小类</SelectItem>
            {minorOptions.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            没有找到衣物，点右上角「添加」上传一件吧
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((item) => (
              <div key={item.id} className="relative">
                <ClothingCard
                  item={item}
                  onClick={() => navigate(`/try-on?focus=${item.id}`)}
                  footer={
                    <div className="mt-1 flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/add-clothing?edit=${item.id}`);
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        aria-label="编辑"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDelId(item.id);
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        aria-label="删除"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除这件衣物？</AlertDialogTitle>
            <AlertDialogDescription>
              「{toDelete?.name}」将被移出衣橱，此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (delId) deleteClothing(delId);
                setDelId(null);
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
