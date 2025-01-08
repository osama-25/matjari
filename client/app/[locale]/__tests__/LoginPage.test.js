import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../login/page';
import { login } from '../../../lib';

// Mock TextEncoder
global.TextEncoder = class {
  encode(str) {
    return new Uint8Array([...str].map(c => c.charCodeAt(0)));
  }
};

// Mock dependencies
const mockPush = jest.fn();
const mockPathname = '/en/login';
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

jest.mock('../../../lib', () => ({
  login: jest.fn()
}));

// Mock localStorage with jest.spyOn
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    render(<LoginPage />);

    // Check for form elements
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('pass')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('emailph')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('passph')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login With Google' })).toBeInTheDocument();
    expect(screen.getByText('newacc')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('email');
    const passwordInput = screen.getByLabelText('pass');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('toggles password visibility', async () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText('pass');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(passwordInput).toHaveAttribute('type', 'text');

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles successful login', async () => {
    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          token: 'test-token',
          message: 'Login successful'
        })
      })
    );

    // Mock login function
    login.mockResolvedValueOnce(true);
    
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('email');
    const passwordInput = screen.getByLabelText('pass');
    const submitButton = screen.getByRole('button', { name: 'login' });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      // Verify fetch call
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );
      
      // Verify token storage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      
      // Verify navigation
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  test('handles empty form submission', async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: 'login' });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Incorrect input!')).toBeInTheDocument();
  });

  

  

 
});