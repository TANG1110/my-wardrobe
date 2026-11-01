import { Image } from '@/components/ui/image';
import { Loader2 } from 'lucide-react';

export default function BodyAvatar({
  image,
  loading,
  overlay,
}: {
  image: string;
  loading?: boolean;
  overlay?: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-muted">
      <Image src={image} alt="人物形象" className="w-full" />
      {overlay && (
        <Image
          src={overlay}
          alt="试穿效果"
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">模拟试穿生成中…</span>
        </div>
      )}
    </div>
  );
}
