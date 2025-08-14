// Minimal JSON-RPC 2.0 server over stdio to expose tools in an MCP-like fashion
import { webSearch, httpGet } from '../connectors/web.js';
import { geminiComplete } from '../connectors/gemini.js';

type JsonRpcReq = { jsonrpc: '2.0'; id: number | string; method: string; params?: any };
type JsonRpcRes = { jsonrpc: '2.0'; id: number | string; result?: any; error?: { code: number; message: string } };

const stdin = process.stdin;
const stdout = process.stdout;
stdin.setEncoding('utf8');

const methods: Record<string, Function> = {
  'web.search': async (params: { query: string }) => webSearch(params.query),
  'http.get': async (params: { url: string }) => httpGet(params.url),
  'gemini.complete': async (params: { prompt: string, model?: string }) => geminiComplete(params.prompt, params.model),
  'ping': async () => 'pong'
};

let buffer = '';
stdin.on('data', async (chunk) => {
  buffer += chunk;
  try {
    const lines = buffer.split('\n');
    for (const line of lines.slice(0, -1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let req: JsonRpcReq;
      try {
        req = JSON.parse(trimmed);
      } catch {
        write({ jsonrpc: '2.0', id: null as any, error: { code: -32700, message: 'Parse error' } });
        continue;
      }
      const fn = methods[req.method];
      if (!fn) {
        write({ jsonrpc: '2.0', id: req.id, error: { code: -32601, message: 'Method not found' } });
        continue;
      }
      try {
        const result = await fn(req.params || {});
        write({ jsonrpc: '2.0', id: req.id, result });
      } catch (e: any) {
        write({ jsonrpc: '2.0', id: req.id, error: { code: -32000, message: e.message || 'Internal error' } });
      }
    }
    buffer = lines[lines.length - 1];
  } catch (e) {
    // swallow
  }
});

function write(msg: JsonRpcRes) {
  stdout.write(JSON.stringify(msg) + '\n');
}
