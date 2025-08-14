// src/agents/index.ts
import type { Memory } from '../core/memory.js';

import { ViabilityAnalyst } from './viability.js';
import { ExecutionDesigner } from './executionDesigner.js';
import { PMO } from './pmo.js';
import { OperationsArchitect } from './operationsArchitect.js';
import { CommunicationStrategist } from './communicationStrategist.js';
import { ExecutionAuditor } from './executionAuditor.js';
import { Researcher } from './researcher.js';

// A single agent exposes one or more async actions (methods) that accept { task, memory }
export type AgentFn = (ctx: { task: string; memory: Memory }) => Promise<string>;
export type Agent = Record<string, AgentFn>;

// Give agents a string index so we can access by dynamic string keys safely.
export const agents: Record<string, Agent> = {
  Researcher,              // has: discover(...)
  ViabilityAnalyst,        // has: assess(...)
  ExecutionDesigner,       // has: design(...)
  PMO,                     // has: plan(...)
  OperationsArchitect,     // has: systemize(...)
  CommunicationStrategist, // has: brief(...)
  ExecutionAuditor,        // has: review(...)
};

// (Optional named re-exports if you need them elsewhere)
export { Researcher, ViabilityAnalyst, ExecutionDesigner, PMO, OperationsArchitect, CommunicationStrategist, ExecutionAuditor };
