'use client';
import React, { useEffect, useState } from "react";
import { HomeItem, Item } from "../Item";

const ItemDisplay = ({ Items, Favourited, user_id, HandleFilter, setOrder, order }) => {
    const HandleOrder = (e) => {
        setOrder(e.target.value);
    }

    useEffect(() => {
        if (order != '') {
            console.log('calling handlefilter')
            HandleFilter();
        }
    }, [order])

    return (
        <div className='flex flex-col overflow-x-auto px-4 sm:px-6 py-2 w-full h-full gap-y-4'>
            <span className="flex justify-between items-center mt-4">
                <h1 className="md:hidden"></h1>
                <h1 className="text-3xl font-bold p-2 md:inline hidden">Results</h1>
                <select value={order} onChange={HandleOrder} className="p-2 border border-gray-300 rounded h-fit">
                    <option value="">Most Relevant</option>
                    <option value="lowtohigh">Price: Low to high</option>
                    <option value="hightolow">Price: high to low</option>
                </select>
            </span>
            {Items.length > 0 ?
                <div className="flex flex-col gap-y-5">
                    {Items.map((item, index) => (
                        <HomeItem
                            key={index}
                            id={item.id} name={item.title} image={item.image}
                            price={item.price} heart={Favourited.includes(item.id)}
                            hideFav={item.user_id === user_id}
                        />
                    ))}
                </div> :
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-xl font-bold text-gray-600">No Items Found</h1>
                </div>}
        </div>
    );
}
export default ItemDisplay