import { render, screen, cleanup, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import Listing from "../add_listing/page";

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));

const mockRouter = {
    push: jest.fn(),
};

let mockPathname = '/en/listing';
jest.mock('next/navigation', () => ({
    usePathname: () => mockPathname,
    useRouter: () => mockRouter,
}));

jest.mock('../global_components/dataInfo', () => ({
    getInfo: jest.fn(() => Promise.resolve({ id: '123' })),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Create a more sophisticated mock for FileReader
const mockFileReader = {
    readAsDataURL: jest.fn(),
    result: 'data:image/jpeg;base64,mockImageContent',
    onload: null,
};

// Override the global FileReader constructor
global.FileReader = jest.fn(() => mockFileReader);

// Mock data
const mockCategories = [
    { name: 'electronics' },
    { name: 'mensfashion' }
];

const mockSubcategories = [
    { name: 'Mobile Phones' },
    { name: 'Headphones' }
];

describe("Listing Component", () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        jest.clearAllMocks();
        fetch.mockReset();
        global.alert = jest.fn();

        // Reset FileReader mock
        mockFileReader.readAsDataURL.mockReset();
        mockFileReader.readAsDataURL.mockImplementation(() => {
            setTimeout(() => {
                mockFileReader.onload({ target: { result: mockFileReader.result } });
            }, 0);
        });
    });

    afterEach(cleanup);

    test("Listing form rendering", async () => {
        // Mock only the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        await act(async () => {
            render(<Listing />);
        });

        const elements = [
            "categories", "subcat", "title", "desc", "price", 
            "location", "details", "customDetails", "submitbtn"
        ];

        for (const element of elements) {
            const el = await screen.findByTestId(element);
            expect(el).toBeInTheDocument();
        }

        const photos = await screen.findAllByTestId("photo");
        expect(photos).toHaveLength(4);
        photos.forEach(photo => expect(photo).toBeInTheDocument());

        expect(fetch).toHaveBeenCalledWith("http://localhost:8080/categories");
    });

    test("handles category selection and fetches subcategories", async () => {
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        // Mock the subcategories fetch that will happen after category selection
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubcategories)
            })
        );

        await act(async () => {
            render(<Listing />);
        });

        const categorySelect = await screen.findByTestId('categories');
        
        await act(async () => {
            fireEvent.change(categorySelect, { target: { value: 'electronics' } });
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenCalledWith("http://localhost:8080/categories/electronics");
        });
    });

   test("handles photo upload and deletion", async () => {
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        await act(async () => {
            render(<Listing />);
        });

        // Create a mock file
        const mockFile = new File(['mock content'], 'test-image.jpg', { type: 'image/jpeg' });

        // Get the first upload label
        const fileInput = screen.getAllByTestId('Uploadphoto')[0];

        // Trigger file upload
        await act(async () => {
            //const input = fileInput.querySelector('input[type="file"]');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });
        });

        // Wait for FileReader mock to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Verify the uploaded photo is displayed
        await waitFor(() => {
            const uploadedImage = screen.queryByTestId('photoUploaded');
            expect(uploadedImage).toBeInTheDocument();
            expect(uploadedImage).toHaveAttribute('src', mockFileReader.result);
        }, { timeout: 3000 });

        // Test deletion
        const deleteButton = await screen.findByTestId('deletePhoto');
        await act(async () => {
            fireEvent.click(deleteButton);
        });

        // Verify the photo is removed
        await waitFor(() => {
            const uploadedImage = screen.queryByTestId('photoUploaded');
            expect(uploadedImage).not.toBeInTheDocument();
        });
    });


    test("handles custom details addition and removal", async () => {
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        await act(async () => {
            render(<Listing />);
        });

        const addCustomDetailBtn = await screen.findByTestId('customDetails');
        
        await act(async () => {
            fireEvent.click(addCustomDetailBtn);
        });

        const titleInput = screen.getByPlaceholderText('customtitle');
        const descInput = screen.getByPlaceholderText('customdesc');

        await act(async () => {
            await user.type(titleInput, 'Test Detail');
            await user.type(descInput, 'Test Description');
        });

        expect(titleInput).toHaveValue('Test Detail');
        expect(descInput).toHaveValue('Test Description');

        // Test removal
        const removeButton = screen.getByTestId('removeCustDetails');
        await act(async () => {
            fireEvent.click(removeButton);
        });
    });

    test("successfully creates a listing with photos", async () => {
        // Mock API responses
        fetch
            // Initial categories fetch
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            }))
            // Subcategories fetch
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubcategories)
            }))
            // Photo upload response
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ imgURL: 'https://example.com/image1.jpg' })
            }))
            // Listing creation response
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, id: '123' })
            }));

        await act(async () => {
            render(<Listing />);
        });

        // Fill out the form
        const inputs = {
            categories: 'electronics',
            subcat: 'Mobile Phones',
            title: 'Test Item',
            desc: 'Test Description',
            price: '100',
            location: 'Amman'
        };

        for (const [id, value] of Object.entries(inputs)) {
            const input = await screen.findByTestId(id);
            await act(async () => {
                fireEvent.change(input, { target: { value } });
            });
        }

        // Select condition and delivery options
        const conditionRadio = screen.getByLabelText('condition1');
        const deliveryRadio = screen.getByLabelText('delivery1');
        
        await act(async () => {
            fireEvent.click(conditionRadio);
            fireEvent.click(deliveryRadio);
        });

        // Upload a photo
        const mockFile = new File(['mock content'], 'test-image.jpg', { type: 'image/jpeg' });
        const fileInput = screen.getAllByTestId('Uploadphoto')[0];
        
        await act(async () => {
            //const input = fileInput.querySelector('input[type="file"]');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });
        });

        // Wait for FileReader mock to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Verify photo is uploaded
        await waitFor(() => {
            const uploadedImage = screen.queryByTestId('photoUploaded');
            expect(uploadedImage).toBeInTheDocument();
        });

        // Submit the form
        const submitButton = screen.getByTestId('submitbtn');
        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Verify success alert
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Listing created successfully!');
        });

        // Verify API calls
        expect(fetch).toHaveBeenCalledTimes(4); // Categories, subcategories, photo upload, and listing creation
        
        // Verify form reset
        await waitFor(() => {
            expect(screen.getByTestId('title')).toHaveValue('');
            expect(screen.getByTestId('desc')).toHaveValue('');
            expect(screen.queryByTestId('photoUploaded')).not.toBeInTheDocument();
        });

        // Verify listing creation API call
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/listing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: 'electronics',
                subCategory: 'Mobile Phones',
                title: 'Test Item',
                description: 'Test Description',
                condition: 'New',
                delivery: 'Yes',
                price: '100',
                location: 'Amman',
                userID: '123',
                photos: ['https://example.com/image1.jpg'],
                customDetails: {}
            })
        });
    });

    test("handles form submission with validation when no photos", async () => {
        // Mock all necessary fetch calls
        fetch
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubcategories)
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            }));

        await act(async () => {
            render(<Listing />);
        });

        // Fill out the form
        const inputs = {
            categories: 'electronics',
            subcat: 'Mobile Phones',
            title: 'Test Item',
            desc: 'Test Description',
            price: '100',
            location: 'Amman'
        };

        for (const [id, value] of Object.entries(inputs)) {
            const input = await screen.findByTestId(id);
            await act(async () => {
                fireEvent.change(input, { target: { value } });
            });
        }

        // Select radio buttons
        const conditionRadio = screen.getByLabelText('condition1');
        const deliveryRadio = screen.getByLabelText('delivery1');
        
        await act(async () => {
            fireEvent.click(conditionRadio);
            fireEvent.click(deliveryRadio);
        });

        // Submit form
        const submitButton = screen.getByTestId('submitbtn');
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to create listing: No photos were successfully uploaded'));
        });
    });

    test("handles form submission errors", async () => {
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        // Mock the submission to fail
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        await act(async () => {
            render(<Listing />);
        });

        const submitButton = screen.getByTestId('submitbtn');
        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to create listing'));
        });
    });

    test("handles language toggle", async () => {
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        await act(async () => {
            render(<Listing />);
        });

        // Verify initial direction is ltr (English)
        const form = screen.getByTestId('form');
        expect(form).toHaveAttribute('dir', 'ltr');

        // Find and click the language toggle
        const languageToggle = screen.getByTestId('Languagebtn');
        
        // Mock the pathname change before clicking
        mockPathname = '/ar/listing';
        
        await act(async () => {
            fireEvent.click(languageToggle);
        });

        // Re-render the component with the new locale
        await act(async () => {
            render(<Listing />);
        });

        // Verify the router.push was called with the correct path
        expect(mockRouter.push).toHaveBeenCalledWith('/ar/listing');
    });
});