import { render, screen, cleanup, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import Listing from "../add_listing/page";

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));

jest.mock('next/navigation', () => ({
    usePathname: () => '/en/listing',
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../global_components/dataInfo', () => ({
    getInfo: jest.fn(() => Promise.resolve({ id: '123' })),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Set up a mock FileReader
class MockFileReader {
    readAsDataURL(blob) {
        setTimeout(() => {
            this.onload({ target: { result: 'data:image/png;base64,mockBase64Data' } });
        }, 0);
    }
}

// Replace the global FileReader with our mock
global.FileReader = MockFileReader;

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
        
        // Mock the initial categories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockCategories)
            })
        );

        // Mock the subcategories fetch
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSubcategories)
            })
        );

        // Mock successful image upload
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ imgURL: 'http://example.com/image.jpg' })
            })
        );

        // Mock successful listing creation
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            })
        );

        // Mock window.alert
        global.alert = jest.fn();
    });


    afterEach(() => {
        cleanup();
    });

    test("Listing form rendering", async () => {
        await act(async () => {
            render(<Listing />);
        });

        // Wait for elements to be available
        const categories = await screen.findByTestId("categories");
        const subcat= await screen.findByTestId("subcat");
        const title = await screen.findByTestId("title");
        const description = await screen.findByTestId("desc");
        const price = await screen.findByTestId("price");
        const location = await screen.findByTestId("location");
        const details = await screen.findByTestId("details");
        const customDetails = await screen.findByTestId("customDetails");
        const submit = await screen.findByTestId("submitbtn");
        const photo = await screen.findAllByTestId("photo");

        // Assert elements are present
        expect(categories).toBeInTheDocument();
        expect(subcat).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(location).toBeInTheDocument();
        expect(details).toBeInTheDocument();
        expect(customDetails).toBeInTheDocument();
        expect(submit).toBeInTheDocument();
        //initial 4 photo elements
        expect(photo).toHaveLength(4);
        photo.forEach(element => {
            expect(element).toBeInTheDocument();
        });

        // Verify categories were fetched
        expect(fetch).toHaveBeenCalledWith("http://localhost:8080/categories");
    });

    test("submitting form with all values", async () => {
        await act(async () => {
            render(<Listing />);
        });

       
        

        // Fill out the form
        await act(async () => {
            // Select category
            const categorySelect = screen.getByTestId('categories');
            fireEvent.change(categorySelect, { target: { value: 'electronics' } });
        });

        await act(async () => {
            // Select subcategory
            const subcategorySelect = screen.getByTestId('subcat');
            fireEvent.change(subcategorySelect, { target: { value: 'Mobile Phones' } });
        });

        // Fill title
        await act(async () => {
            const titleInput = screen.getByTestId('title');
            await user.type(titleInput, 'Test Item');
        });

        // Fill description
        await act(async () => {
            const descriptionInput = screen.getByTestId('desc');
            await user.type(descriptionInput, 'This is a test item description');
        });

        // Fill price
        await act(async () => {
            const priceInput = screen.getByTestId('price');
            await user.type(priceInput, '100');
        });

        // Select location
        await act(async () => {
            const locationSelect = screen.getByTestId('location');
            fireEvent.change(locationSelect, { target: { value: 'Amman' } });
        });

        // Select condition and delivery
        await act(async () => {
            const conditionNewRadio = screen.getByLabelText('condition1');
            await user.click(conditionNewRadio);
            const deliveryYesRadio = screen.getByLabelText('delivery1');
            await user.click(deliveryYesRadio);
        });

        // const mockFile = new File(['mock-image'], './test.png', { type: 'image/png' });
        // // Handle file upload
        // await act(async () => {
        //     const fileInput = screen.getAllByTestId("photoUpload");
        //     fireEvent.change(fileInput[0], { target: { files: [mockFile] } });
        //     expect(fileInput[0].files[0]).toEqual(mockFile);
        // });

        // Submit form
        await act(async () => {
            const submitButton = screen.getByTestId('submitbtn');
            await user.click(submitButton);
        });

        // // Wait for form submission and verify
        // await waitFor(() => {
        //     // Verify that fetch was called for listing creation
        //     expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/listing', expect.any(Object));
            
        //     // Verify success alert was shown
        //     expect(global.alert).toHaveBeenCalledWith('Listing created successfully!');
        // });

        // Verify form was reset
        // expect(screen.getByTestId('title')).toHaveValue('');
        // expect(screen.getByTestId('desc')).toHaveValue('');
        // expect(screen.getByTestId('price')).toHaveValue('');
    });

    // test("handles form submission error", async () => {
    //     // Mock fetch to simulate an error
    //     fetch.mockRejectedValueOnce(new Error('Failed to upload image'));

    //     await act(async () => {
    //         render(<Listing />);
    //     });

    //     // Fill out minimum required fields
    //     await act(async () => {
    //         const submitButton = screen.getByTestId('submitbtn');
    //         await user.click(submitButton);
    //     });

    //     // Verify error alert was shown
    //     await waitFor(() => {
    //         expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to create listing'));
    //     });
    // });

    // test("validates required fields", async () => {
    //     await act(async () => {
    //         render(<Listing />);
    //     });

    //     // Try to submit empty form
    //     await act(async () => {
    //         const submitButton = screen.getByTestId('submitbtn');
    //         await user.click(submitButton);
    //     });

    //     // Verify error alert for required fields
    //     await waitFor(() => {
    //         expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('is required'));
    //     });
    // });
});