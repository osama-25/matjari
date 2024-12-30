import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../home/NavBar';

// Create mock functions
const mockPush = jest.fn();
const mockPathname = '/en/home';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => mockPathname),
  useRouter: () => ({
    push: mockPush
  })
}));

jest.mock('../global_components/dataInfo', () => ({
  getInfo: jest.fn()
}));


// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

jest.mock('next/link', () => {
  return ({ href, children, ...props }) => {
    return (
      <a 
        href={href} 
        onClick={(e) => {
          e.preventDefault();
          mockPush(href);
        }}
        {...props}
      >
        {children}
      </a>
    );
  };
});

describe('NavBar', () => {
    beforeEach(() => {
        mockPush.mockClear();
        fetch.mockClear();
        localStorage.clear();
      });
    
      test('handles image search', async () => {
        // Mock successful upload response
        fetch.mockImplementationOnce(() => 
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ imgURL: 'http://example.com/uploaded.jpg' })
          })
        );
    
        render(<NavBar />);
    
        const fileInput = screen.getByTestId('imgInput');
        const file = new File(['dummy image'], 'test.png', { type: 'image/png' });
        
        // Mock FileReader
        const mockFileReader = {
          readAsDataURL: jest.fn(),
          result: 'data:image/png;base64,dummybase64',
          onload: null
        };
        global.FileReader = jest.fn(() => mockFileReader);
        
        await act(async () => {
          const event = {
            target: { files: [file] }
          };
          fireEvent.change(fileInput, event);
          // Trigger FileReader onload
          mockFileReader.onload();
        });
    
        await waitFor(() => {
          // Verify API call
          expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/azure/upload`,
            expect.objectContaining({
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            })
          );
    
          // Verify localStorage
          expect(localStorage.getItem('searchImageUrl')).toBe('http://example.com/uploaded.jpg');
          
          // Verify navigation
          expect(mockPush).toHaveBeenCalledWith('/search?type=image');
        });
      });

  test('renders search input and handles search submit', async () => {
    // Render component
    render(<NavBar />);
    
    // Get elements
    const searchInput = screen.getByTestId('searchInput');
    const searchButton = screen.getByTestId('searchBtn');
    
    // Change input value
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
    });
    
    // Submit search
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // Log mock calls for debugging
    console.log('Mock push calls:', mockPush.mock.calls);
    
    // Assert
    expect(mockPush).toHaveBeenCalledWith('/search?term=test&page=1&pageSize=10');
  });

  test('handles empty search term', async () => {
    render(<NavBar />);
    
    const searchButton = screen.getByTestId('searchBtn');
    
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  test('handles profile link click', async () => {
    render(<NavBar />);
    
    const profileLink = screen.getByTitle('profile');
    fireEvent.click(profileLink);
    
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });
  
  test('handles chats link click', async () => {
    render(<NavBar />);
    
    const chatsLink = screen.getByTitle('chats');
    fireEvent.click(chatsLink);
    
    expect(mockPush).toHaveBeenCalledWith('/chats');
  });
  
  test('handles favorites link click', async () => {
    render(<NavBar />);
    
    const favoritesLink = screen.getByTitle('favourites');
    fireEvent.click(favoritesLink);
    
    expect(mockPush).toHaveBeenCalledWith('/favourites');
  });

  test('handles language toggle', async () => {
    render(<NavBar />);
    const languageButton = screen.getByTestId('flagBtn');
    
    await act(async () => {
      fireEvent.click(languageButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/ar/home');
  });


  test('handles search with enter key', async () => {
    render(<NavBar />);
    const searchInput = screen.getByTestId('searchInput');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });
    });

    expect(mockPush).toHaveBeenCalledWith('/search?term=test&page=1&pageSize=10');
  });

  test('prevents empty search submission', async () => {
    render(<NavBar />);
    const searchButton = screen.getByTestId('searchBtn');
    
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  test('handles image upload error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Upload failed'))
    );

    render(<NavBar />);
    const fileInput = screen.getByTestId('imgInput');
    const file = new File(['dummy image'], 'test.png', { type: 'image/png' });
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: function() {
        setTimeout(() => {
          this.onload();
        }, 0);
      },
      result: 'data:image/png;base64,dummybase64',
    };
    global.FileReader = jest.fn(() => mockFileReader);
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error uploading photo:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
});

 
});