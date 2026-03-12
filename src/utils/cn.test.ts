import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('combines multiple string class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('filters out falsy values (null, undefined, false)', () => {
    expect(cn('btn', null, undefined, false, 'active')).toBe('btn active');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles numbers and strings mixed', () => {
    expect(cn('item', 1, 2)).toBe('item 1 2');
  });
});