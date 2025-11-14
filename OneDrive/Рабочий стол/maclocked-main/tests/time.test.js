import { describe, expect, it } from 'vitest';
import {
  humanizeDiff,
  isBaseWeek,
  zonedDateFromParts,
  getStartOfWeek,
} from '../src/lib/time.js';

describe('time helpers', () => {
  it('форматує різницю часу людиночитно', () => {
    expect(humanizeDiff(15 * 60 * 1000)).toBe('15 хв');
    expect(humanizeDiff(75 * 60 * 1000)).toBe('1 год 15 хв');
    expect(humanizeDiff(25 * 60 * 60 * 1000)).toBe('1 д 1 год');
  });

  it('визначає парність тижня відносно якоря', () => {
    const anchor = zonedDateFromParts({ year: 2024, month: 5, day: 13, hour: 12 });
    const sameWeek = zonedDateFromParts({ year: 2024, month: 5, day: 15, hour: 12 });
    expect(isBaseWeek(sameWeek, anchor)).toBe(true);

    const nextWeek = zonedDateFromParts({ year: 2024, month: 5, day: 20, hour: 12 });
    expect(isBaseWeek(nextWeek, anchor)).toBe(false);
  });

  it('початок тижня завжди в понеділок', () => {
    const date = zonedDateFromParts({ year: 2024, month: 11, day: 14, hour: 12 });
    const start = getStartOfWeek(date);
    expect(start.getUTCDay()).toBe(1);
  });
});
