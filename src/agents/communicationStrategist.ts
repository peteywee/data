import type { Memory } from '../core/memory.js';

export const CommunicationStrategist = {
  async brief({ task, memory }: { task: string, memory: Memory }) {
    await memory.append({ type: 'comms', task, brief: 'Created update brief (stub).' });
    return `[CommunicationStrategist] Created stakeholder brief for: ${task}`;
  }
};
