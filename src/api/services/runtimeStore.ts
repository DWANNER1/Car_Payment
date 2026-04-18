import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const runtimeDir = join(process.cwd(), 'runtime');
const shouldPersist = process.env.NODE_ENV !== 'test';

function ensureRuntimeDir() {
  if (!existsSync(runtimeDir)) {
    mkdirSync(runtimeDir, { recursive: true });
  }
}

export function readRuntimeJson<T>(fileName: string, fallback: T): T {
  if (!shouldPersist) return fallback;

  try {
    const raw = readFileSync(join(runtimeDir, fileName), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeRuntimeJson(fileName: string, value: unknown) {
  if (!shouldPersist) return;

  ensureRuntimeDir();
  writeFileSync(join(runtimeDir, fileName), JSON.stringify(value, null, 2));
}
