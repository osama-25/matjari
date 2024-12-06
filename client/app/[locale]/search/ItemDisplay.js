import React from "react";
import { HomeItem, Item } from "../Item";
import { FaFilter } from "react-icons/fa";

const ItemDisplay = ({ Items }) => {
    return (
        <div className={`flex flex-col overflow-x-auto px-6 py-2 w-full gap-y-3 z-0`}>
            <span className="flex justify-between items-center">
                <div className="w-10 h-8 md:hidden rounded flex items-center justify-center shadow-lg hover:bg-gray-200">
                    <FaFilter size={24} />
                </div>
                <h1 className="text-3xl font-bold p-2 md:inline hidden">Results</h1>
                <select className="p-2 border border-gray-300 rounded h-fit">
                    <option value="">Featured</option>
                    <option value="">Price: Low to high</option>
                    <option value="">Price: high to low</option>
                    <option value="">Most Recent</option>
                </select>
            </span>
            <div className="flex flex-col gap-y-5">
                {Items.map((item, index) => (
                    <HomeItem
                        key={index}
                        id={item.id} name={item.name} image={item.image}
                        price={'$$$'} heart={false}
                    />
                ))}
            </div>
        </div>
    );
}
export default ItemDisplay