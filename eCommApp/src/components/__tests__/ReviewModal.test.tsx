import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReviewModal from '../ReviewModal';
import type { Product } from '../../types';

describe('ReviewModal', () => {
  it('renders nothing when product is null', () => {
    const { container } = render(
      <ReviewModal product={null} onClose={() => {}} onSubmit={() => {}} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders reviews and allows submitting a new one', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const product: Product = {
      id: 'p1',
      name: 'Apple',
      price: 1,
      inStock: true,
      reviews: [
        { author: 'Sam', comment: '<b>Great</b>', date: '2025-01-01T00:00:00.000Z' },
      ],
    };

    render(<ReviewModal product={product} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByText(/reviews for apple/i)).toBeInTheDocument();
    expect(screen.getByText(/sam/i)).toBeInTheDocument();
    expect(screen.getByText('Great')).toBeInTheDocument();

    // Clicking inside modal should not close it
    await user.click(screen.getByText(/reviews for apple/i));
    expect(onClose).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText(/your name/i), 'Jamie');

    // The textarea doesn't have an accessible name; query by placeholder
    await user.type(screen.getByPlaceholderText(/your review/i), 'Nice!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: 'Jamie',
        comment: 'Nice!',
        date: expect.any(String),
      })
    );

    // Close button triggers onClose
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking backdrop calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const product: Product = {
      id: 'p2',
      name: 'Pear',
      price: 2,
      inStock: true,
      reviews: [],
    };

    const { container } = render(
      <ReviewModal product={product} onClose={onClose} onSubmit={() => {}} />
    );

    const backdrop = container.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();

    await user.click(backdrop as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
