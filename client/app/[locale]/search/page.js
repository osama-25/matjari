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
        <>
            <SearchFilter />
            <ItemDisplay Items={items} />
        </>
    )
}
export default SearchPage;