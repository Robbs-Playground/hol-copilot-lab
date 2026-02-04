import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [showThankYou, setShowThankYou] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        request: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowThankYou(true);
    };

    const handleContinue = () => {
        setShowThankYou(false);
        setFormData({ name: '', email: '', request: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="request">Request:</label>
                            <textarea
                                id="request"
                                name="request"
                                value={formData.request}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />

            {showThankYou && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Thank you for your message.</p>
                        <button onClick={handleContinue} className="continue-btn">Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
