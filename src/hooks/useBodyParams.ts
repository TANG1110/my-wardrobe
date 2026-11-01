// EXPORTS: useBodyParams
import { useState } from 'react';
import { store } from '@/lib/store';
import { DEFAULT_BODY } from '@/data/body';
import type { IBodyParams } from '@/data/types';

const KEY = 'body';

export function useBodyParams() {
  const [body, setBody] = useState<IBodyParams>(() => store.get(KEY, DEFAULT_BODY));

  const updateBody = (patch: Partial<IBodyParams>) => {
    const next = { ...body, ...patch };
    setBody(next);
    store.set(KEY, next);
  };

  return { body, updateBody };
}
