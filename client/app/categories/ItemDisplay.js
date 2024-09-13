import React from "react";
import { Item } from "../Item";
import { FaFilter } from "react-icons/fa";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico' },
    { id: 2, name: 'Fashion', image: '/favicon.ico' },
    { id: 3, name: 'Home', image: '/favicon.ico' },
    { id: 4, name: 'Books', image: '/favicon.ico' },
];

const ItemDisplay = ({ onPress, Visible }) => {
    return (
        <div className={`flex flex-col overflow-x-auto px-6 py-2 w-full gap-y-3 ${Visible ? 'blur-sm pointer-events-none' : ''} z-0`}>
            <span className="flex justify-between items-center">
                <div onClick={onPress} className="w-10 h-8 md:hidden rounded flex items-center justify-center shadow-lg hover:bg-gray-200">
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
                {items.map(item => (
                    <Item
                        id={item.id} name={item.name} image={item.image}
                        price={'$$$'} chatid={item.id}
                        desc={'oewnvonwovnoewnvownveyyubybuwejmmmmmmmm'} heart={false}
                    />
                ))}
            </div>
        </div>
    );
}
export default ItemDisplay