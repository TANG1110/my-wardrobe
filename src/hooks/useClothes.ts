// EXPORTS: useClothes
import { useState } from 'react';
import { store } from '@/lib/store';
import { MOCK_CLOTHES } from '@/data/wardrobe';
import type { IClothing } from '@/data/types';

const KEY = 'clothes';
const DELETED_KEY = 'deleted_mock_ids';

function loadInitial(): IClothing[] {
  const saved = store.get<IClothing[]>(KEY, []);
  const deleted = new Set(store.get<string[]>(DELETED_KEY, []));
  const merged = [...saved];
  for (const m of MOCK_CLOTHES) {
    if (!deleted.has(m.id) && !merged.some((c) => c.id === m.id)) merged.push(m);
  }
  return merged;
}

export function useClothes() {
  const [items, setItems] = useState<IClothing[]>(loadInitial);

  const persist = (next: IClothing[]) => {
    setItems(next);
    store.set(KEY, next);
  };

  const addClothing = (c: IClothing) => persist([c, ...items]);

  const updateClothing = (c: IClothing) => persist(items.map((i) => (i.id === c.id ? c : i)));

  const deleteClothing = (id: string) => {
    const target = items.find((i) => i.id === id);
    persist(items.filter((i) => i.id !== id));
    if (target?.source === 'mock') {
      const deleted = new Set(store.get<string[]>(DELETED_KEY, []));
      deleted.add(id);
      store.set(DELETED_KEY, [...deleted]);
    }
  };

  const getById = (id: string) => items.find((i) => i.id === id);

  return { items, addClothing, updateClothing, deleteClothing, getById };
}
