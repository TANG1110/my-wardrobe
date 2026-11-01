// EXPORTS: IBodyOption, BODY_GROUPS, DEFAULT_BODY, bodyImage
import type { Gender, IBodyParams } from './types';
import { BASE } from '@/lib/base';

const img = (n: string) => `${BASE}images/bodies/${n}`;

export interface IBodyOption {
  id: string;
  label: string;
  image: string;
  mapped: { bodyFat: number; shoulderWidth: number; legLength: number; waist: number };
}

export const BODY_GROUPS: Record<Gender, IBodyOption[]> = {
  female: [
    { id: 'standard', label: '标准', image: img('female-standard.png'), mapped: { bodyFat: 40, shoulderWidth: 50, legLength: 50, waist: 50 } },
    { id: 'petite', label: '娇小', image: img('female-petite.png'), mapped: { bodyFat: 35, shoulderWidth: 45, legLength: 42, waist: 48 } },
    { id: 'curvy', label: '丰满', image: img('female-curvy.png'), mapped: { bodyFat: 62, shoulderWidth: 55, legLength: 50, waist: 68 } },
    { id: 'plus-size', label: '微胖', image: img('female-plus.png'), mapped: { bodyFat: 72, shoulderWidth: 60, legLength: 48, waist: 74 } },
    { id: 'tall', label: '高挑', image: img('female-tall.png'), mapped: { bodyFat: 38, shoulderWidth: 52, legLength: 66, waist: 48 } },
    { id: 'slim', label: '纤细', image: img('female-slim.png'), mapped: { bodyFat: 28, shoulderWidth: 42, legLength: 52, waist: 42 } },
  ],
  male: [
    { id: 'standard', label: '标准', image: img('male-standard.png'), mapped: { bodyFat: 45, shoulderWidth: 55, legLength: 50, waist: 55 } },
    { id: 'tall', label: '高挑', image: img('male-tall.png'), mapped: { bodyFat: 42, shoulderWidth: 56, legLength: 66, waist: 52 } },
    { id: 'athletic', label: '健壮', image: img('male-athletic.png'), mapped: { bodyFat: 35, shoulderWidth: 66, legLength: 50, waist: 50 } },
    { id: 'thin', label: '瘦削', image: img('male-thin.png'), mapped: { bodyFat: 28, shoulderWidth: 48, legLength: 52, waist: 45 } },
  ],
};

export function bodyImage(gender: Gender, bodyType: string): string {
  const list = BODY_GROUPS[gender] || BODY_GROUPS.female;
  return list.find((b) => b.id === bodyType)?.image ?? list[0].image;
}

export const DEFAULT_BODY: IBodyParams = {
  height: 165,
  weight: 55,
  gender: 'female',
  bodyType: 'standard',
  bodyFat: 40,
  shoulderWidth: 50,
  legLength: 50,
  waist: 50,
};
