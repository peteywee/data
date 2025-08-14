import { setTimeout as sleep } from 'node:timers/promises';

export type SearchResult = { title: string; url: string; snippet?: string };
export type SearchProvider = 'serpapi' | 'duckduckgo';

export async function webSearch(query: string, opts: { provider?: SearchProvider } = {}): Promise<SearchResult[]> {
  const provider = opts.provider || (process.env.SERPAPI_KEY ? 'serpapi' : 'duckduckgo');

  if (provider === 'serpapi') {
    const key = process.env.SERPAPI_KEY;
    const engine = process.env.SERPAPI_ENGINE || 'google';
    if (!key) throw new Error('SERPAPI_KEY missing');
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', engine);
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', key);
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('SERPAPI request failed: ' + res.statusText);
    const data = await res.json();
    const organic = data.organic_results || data.items || [];
    return organic.slice(0, 10).map((o: any) => ({
      title: o.title || o.position || 'Result',
      url: o.link || o.url,
      snippet: o.snippet || o.snippets?.[0]
    }));
  }

  // Fallback: DuckDuckGo HTML lite scraping (no key). Keep it gentle.
  const ddgUrl = new URL('https://duckduckgo.com/html/');
  ddgUrl.searchParams.set('q', query);
  const res = await fetch(ddgUrl.toString(), { method: 'GET', headers: { 'User-Agent': 'data-gpt/1.0' } });
  const text = await res.text();
  // Very light parse
  const results: SearchResult[] = [];
  const regex = /<a rel="nofollow" class="result__a" href="([^"]+)".*?>(.*?)<\/a>/gms;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) && results.length < 10) {
    const url = m[1];
    const title = m[2].replace(/<.*?>/g, '');
    results.push({ title, url });
  }
  await sleep(200);
  return results;
}

export async function httpGet(url: string): Promise<{ status: number; body: string }> {
  const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'data-gpt/1.0' } });
  const body = await res.text();
  return { status: res.status, body };
}
