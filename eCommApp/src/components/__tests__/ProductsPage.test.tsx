import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ProductsPage from '../ProductsPage';
import { CartContext } from '../../context/CartContext';
import type { Product } from '../../types';

type FetchResponse = { ok: boolean; json: () => Promise<any> };

const apple: Product = {
  id: 'apple',
  name: 'Apple',
  price: 1.25,
  description: 'Crisp and sweet',
  image: 'apple.png',
  reviews: [],
  inStock: true,
};

const grapes: Product = {
  id: 'grapes',
  name: 'Grapes',
  price: 3,
  image: 'grapes.png',
  reviews: [],
  inStock: false,
};

const orange: Product = {
  id: 'orange',
  name: 'Orange',
  price: 2,
  description: 'Juicy',
  reviews: [],
  inStock: true,
};

const pear: Product = {
  id: 'pear',
  name: 'Pear',
  price: 2.5,
  reviews: [],
  inStock: true,
};

function mockFetchSuccessful() {
  const map: Record<string, Product> = {
    'apple.json': apple,
    'grapes.json': grapes,
    'orange.json': orange,
    'pear.json': pear,
  };

  globalThis.fetch = vi.fn(async (url: string) => {
    const file = url.split('/').pop() ?? '';
    const product = map[file];
    if (!product) {
      return { ok: false, json: async () => ({}) } satisfies FetchResponse as any;
    }
    return { ok: true, json: async () => product } satisfies FetchResponse as any;
  }) as any;
}

describe('ProductsPage', () => {
  const addToCart = vi.fn();
  const clearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSuccessful();
  });

  afterEach(() => {
    // @ts-expect-error tests override fetch
    delete globalThis.fetch;
  });

  function renderWithCartContext() {
    return render(
      <MemoryRouter>
        <CartContext.Provider value={{ cartItems: [], addToCart, clearCart } as any}>
          <ProductsPage />
        </CartContext.Provider>
      </MemoryRouter>
    );
  }

  it('shows a loading state, then renders products', async () => {
    renderWithCartContext();

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    expect(await screen.findByText(/our products/i)).toBeInTheDocument();

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Grapes')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
    expect(screen.getByText('Pear')).toBeInTheDocument();

    // inStock branch coverage
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(addButtons[0]).toBeEnabled();
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('calls addToCart when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    renderWithCartContext();

    await screen.findByText(/our products/i);

    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    await user.click(buttons[0]);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ name: 'Apple' }));
  });

  it('opens the ReviewModal when clicking a product image and allows submit/close', async () => {
    const user = userEvent.setup();
    renderWithCartContext();

    await screen.findByText(/our products/i);

    // Only Apple/Grapes have images
    await user.click(screen.getByAltText('Apple'));

    expect(screen.getByText(/reviews for apple/i)).toBeInTheDocument();
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/your name/i), 'Taylor');
    await user.type(screen.getByPlaceholderText(/your review/i), 'Loved it');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Review should appear after ProductsPage updates state
    await waitFor(() => {
      expect(screen.getByText(/taylor/i)).toBeInTheDocument();
      expect(screen.getByText('Loved it')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/reviews for apple/i)).not.toBeInTheDocument();
    });
  });

  it('handles a failed product fetch and still exits loading state (negative scenario)', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const map: Record<string, Product> = {
      'apple.json': apple,
      'grapes.json': grapes,
      'orange.json': orange,
      'pear.json': pear,
    };

    // Make one file fail
    globalThis.fetch = vi.fn(async (url: string) => {
      const file = url.split('/').pop() ?? '';
      if (file === 'orange.json') {
        return { ok: false, json: async () => ({}) } as any;
      }
      return { ok: true, json: async () => map[file] } as any;
    }) as any;

    renderWithCartContext();

    // Loading should eventually go away
    expect(await screen.findByText(/our products/i)).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
