import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const MIGRATIONS_DIR = resolve(__dirname, '../../../db/migrations');

describe('001_create_players migration', () => {
  const filePath = resolve(MIGRATIONS_DIR, '001_create_players.sql');

  it('migration file exists', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('creates players table with required columns', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('create table');
    expect(sql).toContain('players');
    expect(sql).toContain('id');
    expect(sql).toContain('uuid');
    expect(sql).toContain('display_name');
    expect(sql).toContain('elo_rating');
    expect(sql).toContain('1200');
    expect(sql).toContain('wins');
    expect(sql).toContain('losses');
    expect(sql).toContain('created_at');
  });

  it('has index on elo_rating', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('create index');
    expect(sql).toContain('elo_rating');
  });

  it('has unique constraint on display_name', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('unique');
    expect(sql).toContain('display_name');
  });
});

describe('002_create_questions migration', () => {
  const filePath = resolve(MIGRATIONS_DIR, '002_create_questions.sql');

  it('migration file exists', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('creates questions table with required columns', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('create table');
    expect(sql).toContain('questions');
    expect(sql).toContain('id');
    expect(sql).toContain('uuid');
    expect(sql).toContain('category');
    expect(sql).toContain('text');
    expect(sql).toContain('choices');
    expect(sql).toContain('jsonb');
    expect(sql).toContain('correct_index');
    expect(sql).toContain('difficulty');
  });

  it('has CHECK constraints on correct_index and difficulty', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('check');
    expect(sql).toMatch(/correct_index.*between.*0.*3|correct_index.*>=.*0/);
    expect(sql).toMatch(/difficulty.*between.*1.*3|difficulty.*>=.*1/);
  });

  it('has index on category', () => {
    const sql = readFileSync(filePath, 'utf-8').toLowerCase();
    expect(sql).toContain('create index');
    expect(sql).toContain('category');
  });
});
