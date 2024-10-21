'use client';

import Link from "next/link";
import React, { useState } from "react";

const SubCategory = ({ link, name }) => {
    return (
        <Link href={link} className="text-blue-500 mx-2">
            {name}
        </Link>
    );
}

const SearchFilter = ({ Categories }) => {
    const [showMore, setShowMore] = useState(false);

    const visibleCategories = showMore ? Categories : Categories.slice(0, 4);
    return (
        <>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="mb-6 flex flex-col gap-2 mx-2">
                <h4 className="text-md font-bold mb-2">Categories</h4>
                {visibleCategories.map(category => (
                    <SubCategory link={category.link} name={category.name} />
                ))}
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-blue-500 mt-2"
                >
                    {showMore ? "See Less" : "See More"}
                </button>
            </div>

            <div className="mb-6 mx-2">
                <h4 className="text-md font-medium mb-2">Price Range</h4>
                <label className="block mb-2 mx-2">
                    Min Price:
                    <input
                        type="number"
                        name="min"
                        className="ml-3 p-1 border border-gray-300 rounded w-32"
                    />
                </label>
                <label className="block mb-2 mx-2">
                    Max Price:
                    <input
                        type="number"
                        name="max"
                        className="ml-2 p-1 border border-gray-300 rounded w-32"
                    />
                </label>
            </div>

            <div className="mb-6 mx-2">
                <h4 className="text-md font-medium mb-2">City</h4>
                <select className="p-2 border border-gray-300 rounded w-full">
                    <option value="">Select a city</option>
                    <option value="new-york">New York</option>
                    <option value="los-angeles">Los Angeles</option>
                    <option value="chicago">Chicago</option>
                </select>
            </div>
        </>
    );
}
export default SearchFilter