import 'dotenv/config';
import { orchestrate } from './core/orchestrator.js';
import { createMemory } from './core/memory.js';

const args = process.argv.slice(2);
const taskArgIndex = args.indexOf('--task');
const task = taskArgIndex >= 0 ? args[taskArgIndex + 1] : 'Run sample evaluation plan.';

const memory = createMemory({ filename: '.data/memory.json' });

(async () => {
  await orchestrate({ task, memory });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
