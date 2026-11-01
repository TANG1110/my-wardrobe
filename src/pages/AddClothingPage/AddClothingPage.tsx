import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useClothes } from '@/hooks/useClothes';
import { mockCutout } from '@/lib/mock-ai';
import { MAJOR_LABEL, MINOR_BY_MAJOR } from '@/data/wardrobe';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import type { Fit, Major } from '@/data/types';

const FITS: { value: Fit; label: string }[] = [
  { value: 'slim', label: '修身' },
  { value: 'regular', label: '合身' },
  { value: 'loose', label: '宽松' },
];

export default function AddClothingPage() {
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const { items, addClothing, updateClothing } = useClothes();
  const editing = editId ? items.find((i) => i.id === editId) : undefined;
  const navigate = useNavigate();

  const [image, setImage] = useState(editing?.image ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [major, setMajor] = useState<Major>(editing?.category.major ?? 'top');
  const [minor, setMinor] = useState(editing?.category.minor ?? MINOR_BY_MAJOR.top[0]);
  const [fit, setFit] = useState<Fit>(editing?.category.fit ?? 'regular');
  const [length, setLength] = useState(editing?.params.length ?? 5);
  const [color, setColor] = useState(editing?.params.color ?? '');
  const [material, setMaterial] = useState(editing?.params.material ?? '');
  const [style, setStyle] = useState(editing?.params.style ?? '');
  const [cutting, setCutting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCutting(true);
    try {
      const url = await mockCutout(f);
      setImage(url);
      toast.success('抠图完成（本地模拟）');
    } catch {
      toast.error('图片处理失败');
    } finally {
      setCutting(false);
    }
  };

  const onMajorChange = (v: string) => {
    const m = v as Major;
    setMajor(m);
    setMinor(MINOR_BY_MAJOR[m][0]);
  };

  const save = () => {
    if (!image) {
      toast.error('请先上传衣物图片');
      return;
    }
    if (!name.trim()) {
      toast.error('请填写衣物名称');
      return;
    }
    setSubmitting(true);
    const category = { major, minor, fit };
    const p = { length, color, material, style };
    if (editing) {
      updateClothing({ ...editing, name: name.trim(), image, category, params: p });
      toast.success('衣物已更新');
    } else {
      const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      addClothing({
        id,
        name: name.trim(),
        image,
        category,
        params: p,
        createdAt: Date.now(),
        source: 'user',
      });
      toast.success('衣物已添加');
    }
    navigate('/wardrobe');
  };

  return (
    <div>
      <PageHeader title={editing ? '编辑衣物' : '添加衣物'} />
      <div className="space-y-5 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-48 w-40 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {image ? (
              <Image src={image} alt={name} className="h-full w-full object-cover" />
            ) : cutting ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">AI 抠图中…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">上传衣物照片</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            <span className="text-xs text-primary underline">{image ? '更换图片' : '选择图片上传'}</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <Label>名称</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：白色圆领T恤" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>大类</Label>
            <Select value={major} onValueChange={onMajorChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MAJOR_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>小类</Label>
            <Select value={minor} onValueChange={setMinor}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MINOR_BY_MAJOR[major].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>版型</Label>
            <Select value={fit} onValueChange={(v) => setFit(v as Fit)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FITS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>长度（{length}/10）</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={length}
              onChange={(e) => setLength(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>颜色</Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="白" />
          </div>
          <div className="space-y-1.5">
            <Label>材质</Label>
            <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="棉" />
          </div>
          <div className="space-y-1.5">
            <Label>风格</Label>
            <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="休闲" />
          </div>
        </div>

        <Button className="w-full" disabled={submitting || cutting} onClick={save}>
          {editing ? '保存修改' : '添加到衣橱'}
        </Button>
      </div>
    </div>
  );
}
