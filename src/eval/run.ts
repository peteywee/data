import { score } from './metrics.js';

const s = score({ planAccuracy: 0.8, toolSuccess: 0.9, latencyMs: 1200 });
console.log('Eval score:', s.toFixed(3));
