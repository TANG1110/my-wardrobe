// 前端模拟 AI 能力（本地工程没有平台运行时，抠图/试穿用假流程实现，能点通）
// 说明：这是模拟实现，不调用真实 AI；接入真实能力时替换这两个函数即可。
import type { IClothing } from '@/data/types';

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** 模拟 AI 抠图：直接把上传图片读成 dataURL，加一段加载延迟 */
export async function mockCutout(file: File): Promise<string> {
  await wait(1200);
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

/** 模拟 AI 试穿：延迟后返回提示信息（前端无真实合成，效果占位） */
export async function mockTryOn(clothes: IClothing[]): Promise<string> {
  await wait(1600);
  if (clothes.length === 0) throw new Error('请先选择至少一件衣物');
  return `已模拟生成试穿效果（本地演示）：${clothes.map((c) => c.name).join('、')}`;
}
