'use client';
import React, { use, useEffect, useState } from "react";
import SearchFilter from "../../search/SearchFilter";
import ItemDisplay from "../../search/ItemDisplay";
import ErrorPage from "../../ErrorPage";
import { getInfo } from "../../global_components/dataInfo";
import { Router } from "next/router";

const SubCategories = ({ params }) => {
    const subcategory = use(params).slug;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [user_id, setUserId] = useState(null);
    const [favourited, setFavourited] = useState([]);
    const [filter, setFilter] = useState({
        minPrice: '',
        maxPrice: '',
        location: '',
        delivery: '',
        condition: ''
    });
    const [totalPages, setTotalPages] = useState(0);
    const [order, setOrder] = useState('');

    const isFilterEmpty = () => {
        return Object.values(filter).every(value => value === '');
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${subcategory}/${currentPage}/${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch items: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setItems(data.items);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        }
        if (isFilterEmpty() && order == '') {
            fetchItems();
        }
        else {
            HandleFilter();
        }
    }, [currentPage]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const info = await getInfo();
                console.log(info);
                if (info) {
                    setUserId(info.id);
                }
            } catch (error) {
                //setError(error.message);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchFavourited = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/batch/${user_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch favourited state');
                }

                const data = await response.json();

                setFavourited(data.favorites);
            } catch (error) {
                setError(error.message);
            }
        }
        if (user_id) {
            fetchFavourited();
        }
    }, [user_id]);

    if (error) {
        return <ErrorPage message={error} statusCode={404} />;
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const HandleFilter = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/filter/${subcategory}/${currentPage}/${itemsPerPage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...filter, order })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch filter results');
            }

            const data = await response.json();
            setItems(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex">
            <SearchFilter HandleFilter={HandleFilter} formData={filter} setFormData={setFilter} />
            <div className="flex flex-col justify-between w-full">
                <ItemDisplay Items={items} Favourited={favourited} user_id={user_id} HandleFilter={HandleFilter} order={order} setOrder={setOrder} />
                <div className="flex justify-center items-center space-x-2 my-4">
                    {Array.from({ length: totalPages }, (_, index) => (
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