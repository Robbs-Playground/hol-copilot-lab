import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { validateEmail } from '../utils/helpers';

const ContactPage = () => {
    const [showThankYou, setShowThankYou] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Reset errors
        const newErrors = {
            name: '',
            email: '',
            message: ''
        };

        // Validate all fields
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        // If there are errors, set them and don't submit
        if (newErrors.name || newErrors.email || newErrors.message) {
            setErrors(newErrors);
            return;
        }

        // Clear errors and show success
        setErrors({ name: '', email: '', message: '' });
        setShowThankYou(true);
    };

    const handleContinue = () => {
        setShowThankYou(false);
        setFormData({ name: '', email: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                        Have a question or feedback? We'd love to hear from you!
                    </p>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                            />
                            {errors.message && <span className="error-message">{errors.message}</span>}
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />

            {showThankYou && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Thanks! We'll get back to you soon.</p>
                        <button onClick={handleContinue} className="continue-btn">Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
