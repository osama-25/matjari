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

describe('SearchPage', () => {  // Removed async
  const mockUser = { id: 1, username: 'testuser' };
  const mockItems = [
    { id: 1, name: 'Test Item 1', price: 100 },
    { id: 2, name: 'Test Item 2', price: 200 }
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

    // Update mock items to match component structure
    const mockItems = [
        { 
            id: 1, 
            title: 'Test Item 1',  // Changed from name to title
            price: '100',
            images: ['test1.jpg']
        },
        { 
            id: 2, 
            title: 'Test Item 2',
            price: '200',
            images: ['test2.jpg']
        }
    ];

    fetch.mockImplementation((url) => {
        if (url.includes('/search')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ items: mockItems })
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
  });

  test('handles image search successfully', async () => {
    getInfo.mockResolvedValue(mockUser);
    mockParams.type = 'image';
    localStorage.setItem('searchImageUrl', 'http://example.com/image.jpg');

    fetch.mockImplementation((url) => {
      if (url.includes('/imageDesc/search-by-image')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ items: mockItems })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ favorites: [] })
      });
    });

    render(<SearchPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/imageDesc/search-by-image?page=1&pageSize=5',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ image: 'http://example.com/image.jpg' })
        })
      );
    });

    expect(localStorage.getItem('searchImageUrl')).toBeNull();
  });

  

  test('handles pagination correctly', async () => {
    getInfo.mockResolvedValue(mockUser);
    mockParams.term = 'test';

    const manyItems = Array(15).fill(null).map((_, i) => ({
      id: i,
      name: `Item ${i}`,
      price: 100
    }));

    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: manyItems })
      })
    );

    render(<SearchPage />);

    await waitFor(() => {
      const pageButtons = screen.getAllByRole('button', { name: /[0-9]/ });
      expect(pageButtons.length).toBeGreaterThan(1);
    });
  });

  
});