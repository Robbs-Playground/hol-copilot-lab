import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Keep this test focused on route wiring.
vi.mock('./components/HomePage', () => ({ default: () => <div>HOME</div> }));
vi.mock('./components/ProductsPage', () => ({ default: () => <div>PRODUCTS</div> }));
vi.mock('./components/LoginPage', () => ({ default: () => <div>LOGIN</div> }));
vi.mock('./components/AdminPage', () => ({ default: () => <div>ADMIN</div> }));
vi.mock('./components/CartPage', () => ({ default: () => <div>CART</div> }));

import App from './App';

describe('App routing', () => {
  it('renders the Home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });

  it('renders the Cart route', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('CART')).toBeInTheDocument();
  });

  it('renders the Products route', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('PRODUCTS')).toBeInTheDocument();
  });
});
