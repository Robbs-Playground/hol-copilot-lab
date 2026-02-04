import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactPage from '../ContactPage';

describe('ContactPage', () => {
  it('renders contact form with all fields', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/have a question or feedback/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('allows user to fill out form', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email:/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message:/i) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'I have a question' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(messageInput.value).toBe('I have a question');
  });

  it('shows validation errors for empty fields', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const messageInput = screen.getByLabelText(/message:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('clears error when user starts typing', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Submit empty form to trigger errors
    fireEvent.click(submitButton);
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    // Start typing to clear error
    fireEvent.change(nameInput, { target: { value: 'J' } });
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('shows thank you message after successful form submission', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const messageInput = screen.getByLabelText(/message:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'I have a question' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/thanks! we'll get back to you soon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('clears form and closes modal when Continue is clicked', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email:/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message:/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'I have a question' } });
    fireEvent.click(submitButton);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    expect(screen.queryByText(/thanks! we'll get back to you soon/i)).not.toBeInTheDocument();
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });
});
