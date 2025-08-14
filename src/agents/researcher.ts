import type { Memory } from '../core/memory.js';
import { webSearch, httpGet } from '../connectors/web.js';
import { geminiComplete } from '../connectors/gemini.js';

export const Researcher = {
  async discover({ task, memory }: { task: string, memory: Memory }) {
    const q = task;
    const results = await webSearch(q);
    await memory.append({ type: 'research', task, results });
    // Optionally summarize via Gemini if key present
    let summary = 'No Gemini summary (missing key).';
    try {
      summary = await geminiComplete(`Summarize these URLs and how they relate to: "${q}"\n` + results.map(r => `${r.title} - ${r.url}`).join('\n'));
    } catch {}
    await memory.append({ type: 'research-summary', task, summary });
    return `[Researcher] Found ${results.length} results.\nSummary: ${summary.slice(0, 500)}...`;
  }
};
