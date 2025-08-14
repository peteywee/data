import { agents } from '../agents/index.js';
import type { Memory } from './memory.js';

export async function routeToAgent(agentName: string, action: string, ctx: { task: string, memory: Memory }) {
  const agent = agents[agentName];
  if (!agent) return `[${agentName}] not implemented`;
  const fn = (agent as any)[action];
  if (typeof fn !== 'function') return `[${agentName}] action '${action}' not implemented`;
  return await fn(ctx);
}
