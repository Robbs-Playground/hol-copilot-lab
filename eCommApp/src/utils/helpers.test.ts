import { describe, it, expect } from 'vitest';

import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('utils/helpers', () => {
  it('formatPrice formats USD currency', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(12.5)).toBe('$12.50');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('calculateTotal sums price * quantity', () => {
    expect(calculateTotal([])).toBe(0);
    expect(
      calculateTotal([
        { price: 10, quantity: 2 },
        { price: 1.25, quantity: 4 },
      ])
    ).toBe(25);
  });

  it('validateEmail accepts valid emails and rejects invalid ones', () => {
    expect(validateEmail('a@b.com')).toBe(true);
    expect(validateEmail('user.name+tag@sub.domain.com')).toBe(true);

    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('a@b')).toBe(false);
    expect(validateEmail('a@b.')).toBe(false);
    expect(validateEmail('a@ b.com')).toBe(false);
  });
});
