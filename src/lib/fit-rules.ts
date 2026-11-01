// 适合度评分 + 雷点提示（简单规则引擎）
import type { IClothing, IBodyParams } from '@/data/types';

export interface IFitResult {
  score: number; // 0-100
  verdict: '高' | '中' | '低';
  tips: string[];
}

export function evaluateFit(clothes: IClothing[], body: IBodyParams): IFitResult {
  let score = 60;
  const tips: string[] = [];
  const waist = body.waist;
  const legLength = body.legLength;
  const bodyFat = body.bodyFat;

  for (const c of clothes) {
    const fit = c.category.fit;
    const len = c.params.length;
    const major = c.category.major;

    // 版型与腰围/体脂匹配
    if (major !== 'accessory' && major !== 'shoes') {
      if (fit === 'slim' && waist > 60) { score -= 6; tips.push(`「${c.name}」偏修身，腰腹较宽时可能紧绷`); }
      if (fit === 'slim' && bodyFat > 60) { score -= 5; tips.push(`「${c.name}」修身款可能显拘束`); }
      if (fit === 'loose' && waist < 44) { score += 4; tips.push(`「${c.name}」宽松款适合你，藏得住又舒适`); }
      if (fit === 'loose' && bodyFat > 68) { score += 3; }
    }

    // 衣长与腿长匹配
    if (major === 'coat' || major === 'dress') {
      if (len >= 8 && legLength < 46) { score -= 5; tips.push(`「${c.name}」偏长，腿长比例不大时容易压个子`); }
      if (len <= 5 && legLength > 62) { score += 3; tips.push(`「${c.name}」短款能拉高腰线，适合你的腿长`); }
    }

    // 下装
    if (major === 'bottom') {
      if (len >= 8 && legLength < 46) { score -= 4; tips.push(`「${c.name}」长裤对小个子可能拖沓`); }
      if (len <= 4 && legLength > 62) { score += 3; }
    }
  }

  // 空搭配给一个默认
  if (clothes.length === 0) {
    return { score: 0, verdict: '低', tips: ['还没有选择任何衣物'] };
  }

  score = Math.max(10, Math.min(96, Math.round(score)));
  const verdict = score >= 78 ? '高' : score >= 55 ? '中' : '低';
  return { score, verdict, tips };
}
