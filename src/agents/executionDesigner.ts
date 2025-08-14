import type { Memory } from '../core/memory.js';

export const ExecutionDesigner = {
  async design({ task, memory }: { task: string, memory: Memory }) {
    await memory.append({ type: 'exec-design', task, steps: ['step1','step2'] });
    return `[ExecutionDesigner] Drafted execution steps for: ${task}`;
  }
};
