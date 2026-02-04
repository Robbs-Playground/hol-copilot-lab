import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';
import HomePage from '../HomePage';

describe('Header / Footer / HomePage', () => {
  it('Header renders navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /the daily harvest/i })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');

    // Link wraps a button
    expect(screen.getByRole('button', { name: /admin login/i })).toBeInTheDocument();
  });

  it('Footer renders copyright line', () => {
    render(<Footer />);
    expect(screen.getByText(/©\s*2025\s*the daily harvest/i)).toBeInTheDocument();
  });

  it('HomePage renders its main content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome to the the daily harvest/i)).toBeInTheDocument();
    expect(screen.getByText(/check out our products page/i)).toBeInTheDocument();
  });
});
