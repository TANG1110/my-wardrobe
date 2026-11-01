import { Image } from '@/components/ui/image';
import { MAJOR_LABEL } from '@/data/wardrobe';
import type { ReactNode } from 'react';
import type { IClothing } from '@/data/types';

export default function ClothingCard({
  item,
  onClick,
  footer,
}: {
  item: IClothing;
  onClick: () => void;
  footer?: ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-xl border bg-card text-left transition hover:shadow-sm"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">{MAJOR_LABEL[item.category.major]}</p>
        {footer}
      </div>
    </div>
  );
}
