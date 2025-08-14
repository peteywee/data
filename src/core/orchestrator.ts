import ora from 'ora';
import boxen from 'boxen';
import { z } from 'zod';
import { routeToAgent } from './router.js';
import type { Memory } from './memory.js';

export const OrchestrationInput = z.object({
  task: z.string().min(1),
  memory: z.custom<Memory>()
});

export async function orchestrate(input: z.infer<typeof OrchestrationInput>) {
  const { task, memory } = OrchestrationInput.parse(input);
  const spinner = ora(`Planning: ${task}`).start();
  const plan = [
    { agent: 'Researcher', action: 'discover' },
    { agent: 'ViabilityAnalyst', action: 'assess' },
    { agent: 'ExecutionDesigner', action: 'design' },
    { agent: 'PMO', action: 'plan' },
    { agent: 'OperationsArchitect', action: 'systemize' },
    { agent: 'CommunicationStrategist', action: 'brief' },
    { agent: 'ExecutionAuditor', action: 'review' },
  ];
  spinner.succeed('Plan created');

  const outputs: string[] = [];
  for (const step of plan) {
    const out = await routeToAgent(step.agent, step.action, { task, memory });
    outputs.push(out);
  }

  const result = outputs.join('\n\n');
  console.log(boxen(result, { padding: 1, borderStyle: 'round' }));
  await memory.append({ type: 'run', task, outputs, ts: Date.now() });
}
