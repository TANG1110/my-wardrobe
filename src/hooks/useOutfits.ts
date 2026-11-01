// EXPORTS: useOutfits
import { useState } from 'react';
import { store } from '@/lib/store';
import type { IOutfit } from '@/data/types';

const KEY = 'outfits';

export function useOutfits() {
  const [outfits, setOutfits] = useState<IOutfit[]>(() => store.get(KEY, []));

  const saveOutfit = (o: IOutfit) => {
    const next = [o, ...outfits];
    setOutfits(next);
    store.set(KEY, next);
  };

  const removeOutfit = (id: string) => {
    const next = outfits.filter((o) => o.id !== id);
    setOutfits(next);
    store.set(KEY, next);
  };

  const incWear = (id: string) => {
    const next = outfits.map((o) => (o.id === id ? { ...o, wearCount: o.wearCount + 1 } : o));
    setOutfits(next);
    store.set(KEY, next);
  };

  return { outfits, saveOutfit, removeOutfit, incWear };
}
