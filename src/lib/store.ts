// localStorage 带项目命名空间封装（读写作 try/catch，隐私模式静默降级）
const NS = 'my-wardrobe';

export const store = {
  get<T>(k: string, fb: T): T {
    try {
      const v = localStorage.getItem(`${NS}:${k}`);
      return v ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(`${NS}:${k}`, JSON.stringify(v));
    } catch {
      /* 隐私模式 / 禁用站点数据时静默降级 */
    }
  },
};
