import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

export interface Memory {
  append: (item: any) => Promise<void>;
  readAll: () => Promise<any[]>;
}

export function createMemory(opts: { filename: string }): Memory {
  const file = opts.filename;
  return {
    async append(item) {
      await mkdir(dirname(file), { recursive: true });
      const data = await this.readAll();
      data.push(item);
      await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
    },
    async readAll() {
      try {
        const raw = await fs.readFile(file, 'utf8');
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
  }
}
