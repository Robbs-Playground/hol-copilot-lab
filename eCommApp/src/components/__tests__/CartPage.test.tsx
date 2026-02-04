import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import CartPage from '../CartPage';
import { CartContext, type CartItem } from '../../context/CartContext';

// Keep tests focused on CartPage logic/rendering.
vi.mock('../Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../Footer', () => ({ default: () => <div data-testid="footer" /> }));

// Provide a controllable modal that exposes confirm/cancel triggers.
vi.mock('../CheckoutModal', () => ({
  default: (props: { onConfirm: () => void; onCancel: () => void }) => (
    <div data-testid="checkout-modal">
      <button data-testid="modal-confirm" onClick={props.onConfirm}>confirm</button>
      <button data-testid="modal-cancel" onClick={props.onCancel}>cancel</button>
    </div>
  ),
}));

function renderWithCart(cartItems: CartItem[], clearCart = vi.fn(), updateItemQuantity = vi.fn(), removeFromCart = vi.fn()) {
  return {
    clearCart,
    updateItemQuantity,
    removeFromCart,
    ...render(
      <CartContext.Provider value={{ cartItems, clearCart, updateItemQuantity, removeFromCart } as any}>
        <CartPage />
      </CartContext.Provider>
    ),
  };
}

const sampleItems: CartItem[] = [
  { id: 1, name: 'Widget', price: 1.2, quantity: 2, image: 'widget.png' } as any,
  { id: 2, name: 'Gadget', price: 0, quantity: 999, image: 'gadget.png' } as any,
];

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a helpful error when rendered without CartProvider (negative scenario)', () => {
    expect(() => render(<CartPage />)).toThrow(/CartContext must be used within a CartProvider/i);
  });

  it('renders empty state when cart is empty (edge case)', () => {
    renderWithCart([]);
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByTestId('cart-empty')).toHaveTextContent('Your cart is empty.');
    expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-items-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
  });

  it('renders cart items and checkout button when cart has items', () => {
    renderWithCart(sampleItems);

    expect(screen.getByTestId('cart-items-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('cart-item-card')).toHaveLength(2);

    // Names
    expect(screen.getByText('Widget')).toBeInTheDocument();
    expect(screen.getByText('Gadget')).toBeInTheDocument();

    // Edge formatting: toFixed(2)
    expect(screen.getByText('Price: $1.20')).toBeInTheDocument();
    expect(screen.getByText('Price: $0.00')).toBeInTheDocument();

    // Quantities (including very large)
    expect(screen.getAllByTestId('quantity-display')[0]).toHaveTextContent('2');
    expect(screen.getAllByTestId('quantity-display')[1]).toHaveTextContent('999');

    expect(screen.getByTestId('checkout-btn')).toBeInTheDocument();
    
    // Verify quantity controls are present
    expect(screen.getAllByTestId('decrease-quantity')).toHaveLength(2);
    expect(screen.getAllByTestId('increase-quantity')).toHaveLength(2);
    expect(screen.getAllByTestId('remove-item')).toHaveLength(2);
  });

  it('opens the checkout modal when Checkout is clicked', async () => {
    const user = userEvent.setup();
    renderWithCart(sampleItems);

    await user.click(screen.getByTestId('checkout-btn'));
    expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
  });

  it('closes the checkout modal on cancel and does not clear the cart (negative scenario)', async () => {
    const user = userEvent.setup();
    const { clearCart } = renderWithCart(sampleItems);

    await user.click(screen.getByTestId('checkout-btn'));
    expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();

    await user.click(screen.getByTestId('modal-cancel'));
    expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    expect(clearCart).not.toHaveBeenCalled();
    expect(screen.queryByTestId('order-processed')).not.toBeInTheDocument();
  });

  it('on confirm: clears cart, closes modal, and shows processed order with the original items', async () => {
    const user = userEvent.setup();
    const { clearCart } = renderWithCart(sampleItems);

    await user.click(screen.getByTestId('checkout-btn'));
    await user.click(screen.getByTestId('modal-confirm'));

    expect(clearCart).toHaveBeenCalledTimes(1);

    // Modal no longer visible
    expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();

    // Order processed view
    expect(screen.getByTestId('order-processed')).toBeInTheDocument();
    expect(screen.getByText(/your order has been processed/i)).toBeInTheDocument();

    // Still renders the items that were present at confirmation time
    expect(screen.getByTestId('processed-items-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('processed-item-card')).toHaveLength(2);
    expect(screen.getByText('Widget')).toBeInTheDocument();
    expect(screen.getByText('Gadget')).toBeInTheDocument();

    // Cart view controls should not be present now
    expect(screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-items-grid')).not.toBeInTheDocument();
  });

  it('does not show checkout controls after order is processed (edge case regression)', async () => {
    const user = userEvent.setup();
    renderWithCart(sampleItems);

    await user.click(screen.getByTestId('checkout-btn'));
    await user.click(screen.getByTestId('modal-confirm'));

    expect(screen.getByTestId('order-processed')).toBeInTheDocument();
    expect(screen.queryByTestId('cart-container')).not.toBeInTheDocument();
  });

  it('increases quantity when + button is clicked', async () => {
    const user = userEvent.setup();
    const { updateItemQuantity } = renderWithCart(sampleItems);

    const increaseButtons = screen.getAllByTestId('increase-quantity');
    await user.click(increaseButtons[0]);

    expect(updateItemQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('decreases quantity when - button is clicked', async () => {
    const user = userEvent.setup();
    const { updateItemQuantity } = renderWithCart(sampleItems);

    const decreaseButtons = screen.getAllByTestId('decrease-quantity');
    await user.click(decreaseButtons[0]);

    expect(updateItemQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('removes item when remove button is clicked', async () => {
    const user = userEvent.setup();
    const { removeFromCart } = renderWithCart(sampleItems);

    const removeButtons = screen.getAllByTestId('remove-item');
    await user.click(removeButtons[0]);

    expect(removeFromCart).toHaveBeenCalledWith(1);
  });
});
