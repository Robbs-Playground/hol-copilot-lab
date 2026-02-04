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
    expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/request:/i)).toBeInTheDocument();
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
    const requestInput = screen.getByLabelText(/request:/i) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(requestInput, { target: { value: 'I have a question' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(requestInput.value).toBe('I have a question');
  });

  it('shows thank you modal after form submission', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const requestInput = screen.getByLabelText(/request:/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(requestInput, { target: { value: 'I have a question' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
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
    const requestInput = screen.getByLabelText(/request:/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(requestInput, { target: { value: 'I have a question' } });
    fireEvent.click(submitButton);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    expect(screen.queryByText(/thank you for your message/i)).not.toBeInTheDocument();
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(requestInput.value).toBe('');
  });
});
