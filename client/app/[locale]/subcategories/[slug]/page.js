'use client';
import React, { use, useEffect, useState } from "react";
import SearchFilter from "../../search/SearchFilter";
import ItemDisplay from "../../search/ItemDisplay";
import ErrorPage from "../../ErrorPage";

const SubCategories = ({ params }) => {
    const subcategory = use(params).slug;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:8080/subcategories/${subcategory}/${currentPage}/${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch items: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setItems(data.items);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        }
        fetchItems();
    }, [currentPage]);

    if (error) {
        return <ErrorPage message={error} statusCode={404} />;
    }
    console.log(items);

    // Paginate items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex">
            <SearchFilter />
            <div className="flex flex-col justify-between w-full">
                <ItemDisplay Items={currentItems} />
                <div className="flex justify-center items-center space-x-2 my-4">
                    {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default SubCategories;