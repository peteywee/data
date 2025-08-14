export type Metrics = {
  planAccuracy: number;
  toolSuccess: number;
  latencyMs: number;
};
export function score(m: Metrics) {
  const w = { planAccuracy: 0.5, toolSuccess: 0.3, latencyMs: 0.2 };
  const latencyScore = Math.max(0, 1 - Math.min(m.latencyMs, 10000)/10000);
  return m.planAccuracy*w.planAccuracy + m.toolSuccess*w.toolSuccess + latencyScore*w.latencyMs;
}
