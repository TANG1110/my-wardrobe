// EXPORTS: Major, Fit, ICategory, IClothing, IClothingParams, IOutfit, IDailyLog, Gender, BodyType, IBodyParams

export type Major = 'top' | 'bottom' | 'coat' | 'dress' | 'shoes' | 'accessory';
export type Fit = 'slim' | 'regular' | 'loose';

export interface ICategory {
  major: Major;
  minor: string;
  fit: Fit;
}

export interface IClothingParams {
  length: number; // 1-10
  color: string;
  material: string;
  style: string;
}

export interface IClothing {
  id: string;
  name: string;
  image: string;
  category: ICategory;
  params: IClothingParams;
  createdAt: number;
  source: 'user' | 'mock';
}

export interface IOutfit {
  id: string;
  name: string;
  items: string[];
  createdAt: number;
  wearCount: number;
}

export interface IDailyLog {
  date: string; // YYYY-MM-DD，一天一条
  outfitId: string;
  clothesIds: string[];
  createdAt: number;
}

export type Gender = 'female' | 'male';
export type BodyType = string;

export interface IBodyParams {
  height: number;
  weight: number;
  gender: Gender;
  bodyType: BodyType;
  bodyFat: number;
  shoulderWidth: number;
  legLength: number;
  waist: number;
}
