import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { HomeItem } from "../Item";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico' },
    { id: 2, name: 'Fashion', image: '/favicon.ico' },
    { id: 3, name: 'Home', image: '/favicon.ico' },
    { id: 4, name: 'Books', image: '/favicon.ico' },
];

const ItemsDisplay = () => (
    <div className="flex flex-col overflow-x-auto px-6 py-2 bg-gray-100">
        <span className="flex justify-between">
            <h1 className="text-3xl font-bold p-2 inline">Trending</h1>
            <button>
                <b>See more</b>
                <FaArrowRight className="w-auto h-auto inline p-2" />
            </button>
        </span>
        <div className="grid grid-cols-2 md:flex md:space-x-10">
            {items.map(item => (
                <HomeItem key={item.id} id={item.id} name={item.name} image={item.image} price={'$$$'} />
            ))}
        </div>
    </div>
);
export default ItemsDisplay