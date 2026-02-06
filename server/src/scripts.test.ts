import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('dev scripts', () => {
  it('root package.json has dev scripts', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'),
    );
    expect(pkg.scripts.dev).toContain('concurrently');
    expect(pkg.scripts['dev:server']).toBeDefined();
    expect(pkg.scripts['dev:client']).toBeDefined();
  });

  it('server package.json has tsx watch dev script', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
    );
    expect(pkg.scripts.dev).toContain('tsx watch');
  });

  it('client package.json has vite dev script', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../../client/package.json'), 'utf-8'),
    );
    expect(pkg.scripts.dev).toBe('vite');
  });
});
