import React from "react";
import { HomeItem, Item } from "../Item";
import { FaFilter } from "react-icons/fa";

const ItemDisplay = ({ Items, Favourited }) => {
    return (
        <div className={`flex flex-col overflow-x-auto px-6 py-2 w-full gap-y-4`}>
            <span className="flex justify-between items-center mt-4">
                <h1 className="md:hidden"></h1>
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
                        id={item.id} name={item.title} image={item.main_photo}
                        price={item.price} heart={Favourited.includes(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}
export default ItemDisplay