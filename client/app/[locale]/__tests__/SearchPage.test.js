import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from '../search/page';
import { useSearchParams } from 'next/navigation';

global.fetch = jest.fn();

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  }));

describe('SearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('handles text search correctly', async () => {
    const mockItems = [{ id: 1, name: 'Test Item' }];
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: mockItems })
      })
    );

    useSearchParams.mockReturnValue(new URLSearchParams({ term: 'test' }));

    render(<SearchPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search?term=test'),
        expect.any(Object)
      );
    });
  });

  test('handles image search with valid URL', async () => {
    const mockItems = [{ id: 1, name: 'Test Item' }];
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: mockItems })
      })
    );

    localStorage.setItem('searchImageUrl', 'http://example.com/image.jpg');
    useSearchParams.mockReturnValue(new URLSearchParams({ type: 'image' }));

    render(<SearchPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/imageDesc/search-by-image'),
        expect.any(Object)
      );
    });
  });

  test('retrieves and removes image URL from localStorage', async () => {
    localStorage.setItem('searchImageUrl', 'http://example.com/image.jpg');
    useSearchParams.mockReturnValue(new URLSearchParams({ type: 'image' }));

    render(<SearchPage />);

    await waitFor(() => {
      expect(localStorage.getItem('searchImageUrl')).toBeNull();
    });
  });

  test('renders items when items are returned', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams({ term: 'testtestjkjk' }));

    render(<SearchPage />);

    // Mock state updates
    await waitFor(() => {
      expect(screen.getByText('No items found matching this term: testtestjkjk')).toBeInTheDocument();
    });
  });

  test('handles fetch error correctly', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    useSearchParams.mockReturnValue(new URLSearchParams({ term: 'test' }));

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('No items found matching this term: test')).toBeInTheDocument();
    });
  });

});