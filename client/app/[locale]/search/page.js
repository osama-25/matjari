import React from "react";
import SearchFilter from "./SearchFilter";
import ItemDisplay from "./ItemDisplay";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico', link: '/electronics' },
    { id: 2, name: 'Fashion', image: '/favicon.ico', link: '/fashion' },
    { id: 3, name: 'Home', image: '/favicon.ico', link: '/home' },
    { id: 4, name: 'Books', image: '/favicon.ico', link: '/books' },
];

const SearchPage = () => {
    return (
        <div className="flex relative">
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
export default SearchPage;