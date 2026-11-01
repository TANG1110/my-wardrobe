import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image } from '@/components/ui/image';
import { BODY_GROUPS } from '@/data/body';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Gender, IBodyParams } from '@/data/types';

export default function CharacterPicker({
  body,
  onSave,
  open,
  onOpenChange,
}: {
  body: IBodyParams;
  onSave: (patch: Partial<IBodyParams>) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [gender, setGender] = useState<Gender>(body.gender);
  const [type, setType] = useState(body.bodyType);
  const options = BODY_GROUPS[gender];
  const navigate = useNavigate();

  const pickGender = (g: Gender) => {
    setGender(g);
    setType(BODY_GROUPS[g][0].id);
  };

  const confirm = () => {
    const opt = options.find((o) => o.id === type) ?? options[0];
    onSave({ gender, bodyType: type, ...opt.mapped });
    toast.success('人物形象已更新');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>选择人物形象</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {(['female', 'male'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => pickGender(g)}
                className={cn(
                  'rounded-xl border px-4 py-2.5 text-sm font-medium',
                  gender === g ? 'border-primary bg-primary text-primary-foreground' : 'bg-card',
                )}
              >
                {g === 'female' ? '女性' : '男性'}
              </button>
            ))}
          </div>
          <ScrollArea className="h-56 w-full pr-3">
            <div className="grid grid-cols-3 gap-2">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setType(o.id)}
                  className={cn(
                    'overflow-hidden rounded-xl border bg-card text-center',
                    type === o.id ? 'border-primary ring-2 ring-primary/30' : '',
                  )}
                >
                  <Image src={o.image} alt={o.label} className="aspect-square w-full object-cover" />
                  <span className="block py-1 text-xs">{o.label}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate('/body-settings');
            }}
          >
            体型设置
          </Button>
          <Button className="flex-1" onClick={confirm}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
