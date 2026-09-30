import { describe, it, expect } from 'vitest';
import { formatEventDate } from './formatDate.js';

describe('formatEventDate', () => {
  it('formats ISO dates as day, short month and year', () => {
    expect(formatEventDate('2026-11-14')).toBe('14 Nov 2026');
    expect(formatEventDate('2027-01-01')).toBe('1 Jan 2027');
  });

  it('returns unparseable values unchanged', () => {
    expect(formatEventDate('250301')).toBe('250301');
  });
});
