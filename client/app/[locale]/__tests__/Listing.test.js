import { render, screen, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
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

// Mock data
const mockCategories = [
    { name: 'category1' },
    { name: 'category2' }
];

const mockSubcategories = [
    { name: 'subcategory1' },
    { name: 'subcategory2' }
];

describe("Listing Component", () => {
    beforeEach(() => {
        // Reset all mocks before each test
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

        // Verify categories were fetched
        expect(fetch).toHaveBeenCalledWith("http://localhost:8080/categories");
    });
});