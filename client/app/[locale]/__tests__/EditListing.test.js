import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditListing from '../edit_listing/page';
import { getInfo } from '../global_components/dataInfo';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/en/edit_listing'),
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams({ id: '15' })
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key
}));

// Mock fetch
global.fetch = jest.fn();
global.alert = jest.fn();

jest.mock('../global_components/dataInfo', () => ({
  getInfo: jest.fn()
}));

describe('EditListing Component', () => {
  const mockUserInfo = { id: 6, username: 'testUser' };
  const mockItem = {
    category: 'Electronics',
    sub_category: 'Phones',
    title: 'Test Item',
    description: 'Test Description',
    price: '100',
    location: 'Amman',
    condition: 'New',
    delivery: 'Yes',
    photos: ['photo1.jpg'],
    customDetails: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('successfully fetches user info', async () => {
    getInfo.mockResolvedValueOnce(mockUserInfo);

    // Mock categories
    fetch.mockImplementation((url) => {
      if (url === 'http://localhost:8080/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      if (url.includes('/api/listing/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            category: '',
            sub_category: '',
            title: '',
            description: '',
            condition: '',
            delivery: '',
            price: '',
            location: '',
            photos: [],
            customDetails: []
          })
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    });

    render(<EditListing />);

    await waitFor(() => {
      expect(getInfo).toHaveBeenCalled();
    });

    // Verify form data was updated with user ID
    await waitFor(() => {
      expect(screen.getByTestId('title')).toBeInTheDocument();
    });
  });

  test('handles form input changes', async () => {
    getInfo.mockResolvedValueOnce(mockUserInfo);
    // Mock categories fetch
    fetch.mockImplementation((url) => {
      if (url.includes('categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'Electronics' }])
        });
      }
      // Mock item fetch
      if (url.includes('/api/listing/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItem)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<EditListing />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Test form inputs
    const titleInput = screen.getByTestId('title');
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'New Title' } });
    });

    expect(titleInput).toHaveValue('New Title');
  });

  test('handles form submission successfully', async () => {
    getInfo.mockResolvedValueOnce(mockUserInfo);
    
    // Mock all required API calls
    fetch.mockImplementation((url) => {
      if (url.includes('categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'Electronics' }])
        });
      }
      if (url.includes('/api/listing/15')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItem)
        });
      }
      if (url.includes('update')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    });

    render(<EditListing />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Fill form data
    const titleInput = screen.getByTestId('title');
    const descInput = screen.getByTestId('description');
    const priceInput = screen.getByTestId('price');

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descInput, { target: { value: 'Updated Description' } });
      fireEvent.change(priceInput, { target: { value: '200' } });
    });

    // Submit form
    const form = screen.getByTestId('submitBtn');
    await act(async () => {
      fireEvent.click(form);
    });

    // Verify redirect
    expect(mockPush).toHaveBeenCalledWith('/item/15');
  });
  
  test('renders edit listing form with initial data', async () => {
    // Mock user info
    getInfo.mockResolvedValueOnce(mockUserInfo);

    // Mock API responses
    fetch.mockImplementation((url) => {
      if (url.includes('categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'Electronics' }])
        });
      }
      if (url.includes('/api/listing/15')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItem)
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    });

    render(<EditListing />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify all form fields
    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveValue('Test Item');
      expect(screen.getByTestId('description')).toHaveValue('Test Description');
      expect(screen.getByTestId('price')).toHaveValue(100);
      expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Amman')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New')).toBeChecked();
      expect(screen.getByDisplayValue('Yes')).toBeChecked();
    });
  });

  test('handles single photo upload', async () => {
    getInfo.mockResolvedValueOnce(mockUserInfo);
    
    fetch.mockImplementation((url) => {
      if (url.includes('categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ name: 'Electronics' }])
        });
      }
      if (url.includes('/api/listing/15')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockItem, photos: [] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ imgURL: 'test.jpg' })
      });
    });

    render(<EditListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    const fileInput = screen.getAllByTestId('Uploadphoto')[0];
    const file = new File(['dummy image'], 'test.jpg', { type: 'image/jpeg' });
    
    const mockFileReader = {
      readAsDataURL: function() {
        this.result = 'data:image/jpeg;base64,dummydata';
        this.onload();
      }
    };
    global.FileReader = jest.fn(() => mockFileReader);

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(screen.getByTestId('photoUploaded')).toBeInTheDocument();
  });

  test('handles photo deletion', async () => {
      getInfo.mockResolvedValueOnce(mockUserInfo);
      
      const mockItemWithPhoto = {
        ...mockItem,
        photos: ['data:image/jpeg;base64,dummydata']
      };

      fetch.mockImplementation((url) => {
        if (url.includes('/api/listing/15')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockItemWithPhoto)
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      });

      render(<EditListing />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(screen.getByTestId('photoUploaded')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('deletePhoto');
      await act(async () => {
        fireEvent.click(deleteButton);
      });

      expect(screen.queryByTestId('photoUploaded')).not.toBeInTheDocument();
  });

  

  test('handles multiple photo uploads', async () => {
      getInfo.mockResolvedValueOnce(mockUserInfo);
      
      fetch.mockImplementation((url) => {
        if (url.includes('categories')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ name: 'Electronics' }])
          });
        }
        if (url.includes('/api/listing/15')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ ...mockItem, photos: [] })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ imgURL: 'test.jpg' })
        });
      });

      render(<EditListing />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const fileInputs = screen.getAllByTestId('Uploadphoto');
      const files = [
        new File(['dummy1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['dummy2'], 'test2.jpg', { type: 'image/jpeg' })
      ];

      const mockFileReader = {
        readAsDataURL: function() {
          this.result = 'data:image/jpeg;base64,dummydata';
          this.onload();
        }
      };
      global.FileReader = jest.fn(() => mockFileReader);

      await act(async () => {
        fireEvent.change(fileInputs[0], { target: { files: [files[0]] } });
        fireEvent.change(fileInputs[1], { target: { files: [files[1]] } });
      });

      const uploadedPhotos = screen.getAllByTestId('photoUploaded');
      expect(uploadedPhotos).toHaveLength(2);
  });

  

  test('handles form validation errors', async () => {
      getInfo.mockResolvedValueOnce(mockUserInfo);
      fetch.mockImplementation((url) => {
        if (url.includes('/api/listing/15')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ ...mockItem, title: '' })
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(<EditListing />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submitBtn');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(alert).toHaveBeenCalledWith(expect.stringContaining('title is required'));
  });

  test('handles category and subcategory changes', async () => {
    getInfo.mockResolvedValueOnce(mockUserInfo);
    
    // Mock API calls
    fetch.mockImplementation((url) => {
      // Mock categories endpoint
      if (url === 'http://localhost:8080/categories') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: 'Electronics' },
            { name: 'Clothing' }
          ])
        });
      }
      // Mock subcategories endpoint for Electronics
      if (url === 'http://localhost:8080/categories/Electronics') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { name: 'Laptops' },
            { name: 'Phones' }
          ])
        });
      }
      // Mock listing data
      if (url.includes('/api/listing/15')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockItem)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<EditListing />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Select Electronics category
    const categorySelect = screen.getByLabelText('category');
    await act(async () => {
      fireEvent.change(categorySelect, { target: { value: 'Electronics' } });
    });

    // Verify subcategories loaded
    await waitFor(() => {
      const subcategorySelect = screen.getByTestId('subcat');
      expect(subcategorySelect).toBeInTheDocument();
      
      // Verify Laptops option is present
      const laptopsOption = screen.getByText('Laptops');
      expect(laptopsOption).toBeInTheDocument();
    });

    // Select Laptops subcategory
    const subcategorySelect = screen.getByTestId('subcat');
    await act(async () => {
      fireEvent.change(subcategorySelect, { target: { value: 'Laptops' } });
    });

    // Verify selection
    expect(subcategorySelect.value).toBe('Laptops');
});
});