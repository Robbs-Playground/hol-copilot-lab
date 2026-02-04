import { useContext, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { CartContext, CartItem } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

const CartPage = () => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderProcessed, setOrderProcessed] = useState(false);
    const [processedItems, setProcessedItems] = useState<CartItem[]>([]);
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error('CartContext must be used within a CartProvider');
    }

    const { cartItems, clearCart } = cartContext;

    const handleCheckout = () => {
        setIsCheckingOut(true);
    };

    const handleConfirmCheckout = () => {
        setProcessedItems([...cartItems]);
        clearCart();
        setIsCheckingOut(false);
        setOrderProcessed(true);
    };

    if (orderProcessed) {
        return (
            <div className="app" data-testid="cart-page">
                <Header />
                <main className="main-content">
                    <div className="order-processed-container" data-testid="order-processed">
                        <h2>Your order has been processed!</h2>
                        <div className="cart-items-grid" data-testid="processed-items-grid">
                            {processedItems.map(item => (
                                <div key={item.id} className="cart-item-card" data-testid="processed-item-card">
                                    <img src={`products/productImages/${item.image}`} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app" data-testid="cart-page">
            <Header />
            <main className="main-content">
                <div className="cart-container" data-testid="cart-container">
                    <h2>Your Cart</h2>
                    {cartItems.length === 0 ? (
                        <p data-testid="cart-empty">Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="cart-items-grid" data-testid="cart-items-grid">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item-card" data-testid="cart-item-card">
                                        <img src={`products/productImages/${item.image}`} alt={item.name} className="cart-item-image" />
                                        <div className="cart-item-info">
                                            <h3>{item.name}</h3>
                                            <p>Price: ${item.price.toFixed(2)}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="checkout-btn"
                                data-testid="checkout-btn"
                            >
                                Checkout
                            </button>
                        </>
                    )}
                </div>
            </main>
            <Footer />
            {isCheckingOut && (
                <CheckoutModal
                    onConfirm={handleConfirmCheckout}
                    onCancel={() => setIsCheckingOut(false)}
                />
            )}
        </div>
    );
};

export default CartPage;
