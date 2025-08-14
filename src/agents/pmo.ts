import type { Memory } from '../core/memory.js';

export const PMO = {
  async plan({ task, memory }: { task: string, memory: Memory }) {
    await memory.append({ type: 'pmo', task, kpis: ['latency','success_rate'] });
    return `[PMO] Planned milestones and KPIs for: ${task}`;
  }
};
