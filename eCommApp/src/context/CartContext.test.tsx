import React, { useContext } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CartContext, CartProvider } from './CartContext';
import type { Product } from '../types';

const productA: Product = {
  id: 'a',
  name: 'Apple',
  price: 1.5,
  reviews: [],
  inStock: true,
};

const productB: Product = {
  id: 'b',
  name: 'Banana',
  price: 2,
  reviews: [],
  inStock: true,
};

function Consumer() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('CartContext must be used within a CartProvider');

  const firstQty = ctx.cartItems[0]?.quantity ?? 0;

  return (
    <div>
      <div data-testid="count">{ctx.cartItems.length}</div>
      <div data-testid="first-qty">{firstQty}</div>
      <button onClick={() => ctx.addToCart(productA)}>add-a</button>
      <button onClick={() => ctx.addToCart(productB)}>add-b</button>
      <button onClick={() => ctx.clearCart()}>clear</button>
    </div>
  );
}

describe('CartProvider / CartContext', () => {
  it('adds new items and increments quantity for existing items', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'add-a' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'add-a' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'add-b' }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  it('clears the cart', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );

    await user.click(screen.getByRole('button', { name: 'add-a' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('0');
  });
});
