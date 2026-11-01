// EXPORTS: MAJOR_ORDER, MAJOR_LABEL, MINOR_BY_MAJOR, MOCK_CLOTHES
import type { IClothing, Major } from './types';
import { BASE } from '@/lib/base';

const img = (n: string) => `${BASE}images/clothes/${n}`;

export const MAJOR_ORDER: Major[] = ['top', 'bottom', 'coat', 'dress', 'shoes', 'accessory'];

export const MAJOR_LABEL: Record<Major, string> = {
  top: '上装',
  bottom: '下装',
  coat: '外套',
  dress: '连衣裙',
  shoes: '鞋靴',
  accessory: '配饰',
};

export const MINOR_BY_MAJOR: Record<Major, string[]> = {
  top: ['T恤', '衬衫', '卫衣', '针织'],
  bottom: ['牛仔裤', '休闲裤', '短裤', '半身裙'],
  coat: ['大衣', '风衣', '夹克', '西装'],
  dress: ['连衣裙', '半身裙', '吊带裙'],
  shoes: ['运动鞋', '休闲鞋', '高跟鞋', '靴子'],
  accessory: ['包包', '围巾', '帽子', '腰带'],
};

export const MOCK_CLOTHES: IClothing[] = [
  { id: 'mock_tshirt_white', name: '白棉T恤', image: img('tshirt-white.png'), category: { major: 'top', minor: 'T恤', fit: 'regular' }, params: { length: 4, color: '白', material: '棉', style: '简约' }, createdAt: 1, source: 'mock' },
  { id: 'mock_hoodie_gray', name: '灰连帽卫衣', image: img('hoodie-gray.png'), category: { major: 'top', minor: '卫衣', fit: 'loose' }, params: { length: 5, color: '灰', material: '抓绒', style: '休闲' }, createdAt: 2, source: 'mock' },
  { id: 'mock_shirt_striped', name: '蓝白条纹衫', image: img('shirt-striped.png'), category: { major: 'top', minor: '衬衫', fit: 'regular' }, params: { length: 5, color: '蓝', material: '棉', style: '通勤' }, createdAt: 3, source: 'mock' },
  { id: 'mock_jeans_blue', name: '深蓝牛仔裤', image: img('jeans-blue.png'), category: { major: 'bottom', minor: '牛仔裤', fit: 'regular' }, params: { length: 7, color: '深蓝', material: '牛仔', style: '休闲' }, createdAt: 4, source: 'mock' },
  { id: 'mock_coat_camel', name: '驼色呢大衣', image: img('coat-camel.png'), category: { major: 'coat', minor: '大衣', fit: 'loose' }, params: { length: 8, color: '驼色', material: '呢绒', style: '通勤' }, createdAt: 5, source: 'mock' },
  { id: 'mock_dress_black', name: '黑色连衣裙', image: img('dress-black.png'), category: { major: 'dress', minor: '连衣裙', fit: 'slim' }, params: { length: 6, color: '黑', material: '垂坠', style: '优雅' }, createdAt: 6, source: 'mock' },
  { id: 'mock_shoes_white', name: '小白鞋', image: img('shoes-white.png'), category: { major: 'shoes', minor: '运动鞋', fit: 'regular' }, params: { length: 3, color: '白', material: '皮革', style: '休闲' }, createdAt: 7, source: 'mock' },
  { id: 'mock_bag_beige', name: '米色托特包', image: img('bag-beige.png'), category: { major: 'accessory', minor: '包包', fit: 'regular' }, params: { length: 2, color: '米色', material: '皮质', style: '通勤' }, createdAt: 8, source: 'mock' },
];
