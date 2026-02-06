import { describe, it, expect } from 'vitest';
import { config } from './config.js';

describe('config', () => {
  it('has default port 3000', () => {
    expect(config.port).toBe(3000);
  });

  it('has default database settings', () => {
    expect(config.db.host).toBe('localhost');
    expect(config.db.port).toBe(5432);
    expect(config.db.name).toBe('ignite');
  });
});
