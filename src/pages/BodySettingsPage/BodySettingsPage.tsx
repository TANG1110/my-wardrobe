import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import BodyAvatar from '@/components/BodyAvatar';
import { Image } from '@/components/ui/image';
import { useBodyParams } from '@/hooks/useBodyParams';
import { BODY_GROUPS, bodyImage } from '@/data/body';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Gender } from '@/data/types';

export default function BodySettingsPage() {
  const { body, updateBody } = useBodyParams();
  const [h, setH] = useState(String(body.height));
  const [w, setW] = useState(String(body.weight));
  const options = BODY_GROUPS[body.gender];

  const pickGender = (g: Gender) => {
    const first = BODY_GROUPS[g][0];
    updateBody({ gender: g, bodyType: first.id, ...first.mapped });
  };

  const pickType = (id: string) => {
    const opt = options.find((o) => o.id === id);
    updateBody({ bodyType: id, ...(opt ? opt.mapped : {}) });
  };

  const saveHW = () => {
    const height = Number(h);
    const weight = Number(w);
    updateBody({ height: height > 0 ? height : body.height, weight: weight > 0 ? weight : body.weight });
    toast.success('体型已保存');
  };

  return (
    <div>
      <PageHeader title="体型设置" />
      <div className="space-y-6 p-4">
        <BodyAvatar image={bodyImage(body.gender, body.bodyType)} />

        <div className="space-y-2">
          <Label>性别</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['female', 'male'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => pickGender(g)}
                className={cn(
                  'rounded-xl border px-4 py-3 text-sm font-medium',
                  body.gender === g ? 'border-primary bg-primary text-primary-foreground' : 'bg-card',
                )}
              >
                {g === 'female' ? '女性' : '男性'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>体型档位</Label>
          <div className="grid grid-cols-3 gap-2">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => pickType(o.id)}
                className={cn(
                  'overflow-hidden rounded-xl border bg-card text-center',
                  body.bodyType === o.id ? 'border-primary ring-2 ring-primary/30' : '',
                )}
              >
                <Image src={o.image} alt={o.label} className="aspect-square w-full object-cover" />
                <span className="block py-1.5 text-xs">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>身高 (cm)</Label>
            <Input type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder="165" />
          </div>
          <div className="space-y-1.5">
            <Label>体重 (kg)</Label>
            <Input type="number" value={w} onChange={(e) => setW(e.target.value)} placeholder="55" />
          </div>
        </div>

        <Button className="w-full" onClick={saveHW}>
          保存体型
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          数据仅保存在当前浏览器本地，换设备不共享
        </p>
      </div>
    </div>
  );
}
