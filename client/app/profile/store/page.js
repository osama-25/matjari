import { HomeItem, Item } from "@/app/Item";
import React from "react";

const items = [
    { id: 1, name: 'Electronics', image: '/favicon.ico', link: '/electronics' },
    { id: 2, name: 'Fashion', image: '/favicon.ico', link: '/fashion' },
    { id: 3, name: 'Home', image: '/favicon.ico', link: '/home' },
    { id: 4, name: 'Books', image: '/favicon.ico', link: '/books' },
    { id: 5, name: 'Books', image: '/favicon.ico', link: '/books' },
];

const Store = () => {
    return (
        <section className="border rounded border-gray-300 mt-10 p-2">
            <h1 className="m-2 font-bold">Store</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map(item => (
                    <HomeItem id={item.id} key={item.id} name={item.name} image={item.image} link={item.link} price={'$$$'} />
                ))}
            </div>
        </section>
    );
}
export default Store