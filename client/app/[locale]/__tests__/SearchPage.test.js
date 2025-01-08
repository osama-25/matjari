import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from '../search/page';
import { getInfo } from '../global_components/dataInfo';

// Mock implementations
jest.mock('../global_components/dataInfo');

const mockParams = {
  term: '',
  type: ''
};

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (param) => mockParams[param]
  }),
  usePathname: () => '/en/search',
  useRouter: () => ({
    push: jest.fn()
  })
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

global.fetch = jest.fn();

describe('SearchPage', () => {
  const mockUser = { id: 1, username: 'testuser' };
  const mockItems = [
    { id: 1, title: 'Test Item 1', price: '100', image: 'test1.jpg' },
    { id: 2, title: 'Test Item 2', price: '200', image: 'test2.jpg' }
  ];

  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
    getInfo.mockClear();
    mockParams.term = '';
    mockParams.type = '';
  });

  test('handles text search successfully', async () => {
    getInfo.mockResolvedValue(mockUser);
    mockParams.term = 'test';

    fetch.mockImplementation((url) => {
      if (url.includes('/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ items: mockItems, totalPages: 1 })
        });
      }
      if (url.includes('/api/favorites')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ favorites: [1] })
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<SearchPage />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search?term=test'),
        expect.any(Object)
      );
    });

    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('handles image search successfully', async () => {
    getInfo.mockResolvedValue(mockUser);
    mockParams.type = 'image';
    localStorage.setItem('searchImageUrl', 'http://example.com/image.jpg');

    fetch.mockImplementation((url) => {
      if (url.includes('/imageDesc/search-by-image')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ items: mockItems, totalPages: 1 })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ favorites: [] })
      });
    });

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/imageDesc/search-by-image?page=1&pageSize=5`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ image: 'http://example.com/image.jpg' })
        })
      );
    });

    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    
    // Clear localStorage at end of test
    localStorage.clear();
  });

  
});