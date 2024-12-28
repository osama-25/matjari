import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPage from '../item/[id]/page';
import { getInfo } from '../global_components/dataInfo';

// Mock implementations
jest.mock('../global_components/dataInfo');
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: (promise) => ({
      id: '11',
      locale: 'en'
  })
}));
const mockPush = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
      push: mockPush,
      pathname: '/en/item/11',
      query: { id: '11' },
      asPath: '/en/item/11'
  }),
  usePathname: () => '/en/item/11',
  useParams: () => ({ id: '11', locale: 'en' }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));

const mockSegments = {
  locale: 'en',
  id: '11'
};

global.fetch = jest.fn();

describe('ProductPage', () => {
    const mockItem = {
        id: 1,
        title: 'Test Item',
        price: '100',
        description: 'Test Description',
        category: 'Electronics',
        sub_category: 'Phones',
        condition: 'New',
        delivery: 'Yes',
        location: 'Amman',
        username: 'testuser',
        phone_number: '1234567890',
        email: 'seller@test.com',
        photos: ['photo1.jpg', 'photo2.jpg'],
        customDetails: [{ title: 'Color', description: 'Blue' }],
        user_id: 2
    };

    const mockUser = {
        id: 1,
        email: 'buyer@test.com'
    };

    beforeEach(() => {
        fetch.mockClear();
        mockPush.mockClear();
        getInfo.mockClear();
    });

    test('renders product details correctly', async () => {
        getInfo.mockResolvedValue(mockUser);
        fetch.mockImplementation((url) => {
            if (url.includes('/api/listing/11')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockItem)
                });
            }
            if (url.includes('/api/favorites/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ favourited: false })
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<ProductPage params={Promise.resolve({ id: '11', locale: 'en' })} />);

        await waitFor(() => {
            expect(screen.getByText(mockItem.title)).toBeInTheDocument();
            expect(screen.getByText(`${mockItem.price} JD`)).toBeInTheDocument();
        });
    });

    test('handles chat button click', async () => {
        getInfo.mockResolvedValue(mockUser);
        fetch.mockImplementation((url) => {
            if (url.includes('/api/listing/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockItem)
                });
            }
            if (url.includes('/api/favorites/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ favourited: false })
                });
            }
            if (url.includes('/chat/find-or-create-room')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ room: { id: 1 } })
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<ProductPage params={{ id: '1'} } />);

        await waitFor(() => {
            expect(screen.getByText(mockItem.title)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('chat'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/chats/1');
        });
    });

    test('handles favorite button click', async () => {
        getInfo.mockResolvedValue(mockUser);
        fetch.mockImplementation((url) => {
            if (url.includes('/api/listing/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockItem)
                });
            }
            if (url.includes('/api/favorites/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ favourited: false })
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<ProductPage params={{ id: '1'} } />);

        await waitFor(() => {
            expect(screen.getByText(mockItem.title)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('favBtn'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/favorites', expect.any(Object));
        });
    });

    

    test('handles error state', async () => {
        getInfo.mockResolvedValue(mockUser);
        fetch.mockImplementation((url) => {
            if (url.includes('/api/listing/')) {
                return Promise.resolve({
                    ok: false,
                    statusText: 'Not Found'
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<ProductPage params={{ id: '1'} } />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch item: Not Found')).toBeInTheDocument();
        });
    });
});