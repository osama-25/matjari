'use client';
import { use, useEffect, useState } from 'react';
import SearchFilter from "./SearchFilter";
import { useSearchParams } from 'next/navigation';
import ItemDisplay from "./ItemDisplay";
import { usePathname } from "next/navigation";
import ErrorPage from "../ErrorPage";
import { getInfo } from "../global_components/dataInfo";
import Loading from '@/app/[locale]/global_components/loading';


const SearchPage = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('term') || '';
    const searchType = searchParams.get('type');
    const [imgSrc, setImgSrc] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [items, setItems] = useState([]);
    const pathname = usePathname();
    const locale = pathname.split("/")[1];
    const [user_id, setUserId] = useState(null);
    const [favourited, setFavourited] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        minPrice: '',
        maxPrice: '',
        location: '',
        delivery: '',
        condition: ''
    });
    const [totalPages, setTotalPages] = useState(0);
    const [order, setOrder] = useState('');

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

    const HandleFilter = async () => {
        if (!searchTerm && searchType !== 'image') {
            console.log('No search term provided');
            return;
        }
        try {
            let endpoint;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            console.log(order);
            console.log(searchType);
            if (searchType == 'image') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/imageDesc/search-by-image/filter/${currentPage}/${itemsPerPage}`;
                options.body = JSON.stringify({ ...filter, image: imgSrc, order });
            }
            else {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/search/filter/${currentPage}/${itemsPerPage}`;
                options.body = JSON.stringify({ ...filter, searchTerm, order });
            }

            const response = await fetch(endpoint, options);
            if (!response.ok) {
                throw new Error('Failed to fetch filter results');
            }

            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setItems(data.items);
                setTotalPages(data.totalPages);
                console.log(data.totalItems);
            } else {
                setItems([]);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isItemsReturned, setisItemsReturned] = useState(false);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const fetchSearchResults = async () => {
        if (!searchTerm && searchType !== 'image') {
            console.log('No search term provided');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Fetching search results...');
            let endpoint;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (searchType === 'image') {
                if (!imgSrc) { console.log("there's no URL"); return; }
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/imageDesc/search-by-image?page=${currentPage}&pageSize=${itemsPerPage}`;
                options.method = 'POST';
                options.body = JSON.stringify({ image: imgSrc });
            } else {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/search?term=${encodeURIComponent(searchTerm)}&page=${currentPage}&pageSize=${itemsPerPage}`;
                options.method = 'GET';
            }

            console.log('Search endpoint:', endpoint);
            console.log('Search options:', options.body);

            const response = await fetch(endpoint, options);

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setItems(data.items);
                setTotalPages(data.totalPages);
                console.log('Items:', data.items);
                setisItemsReturned(true);
            } else {
                setItems([]);
                setisItemsReturned(false);
            }

        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const isFilterEmpty = () => {
        return Object.values(filter).every(value => value === '');
    };
    
    const storedImageUrl = localStorage.getItem('searchImageUrl');
    useEffect(() => {
        if (searchType === 'image' && storedImageUrl) {
            setImgSrc(storedImageUrl);
        }
    }, [searchType, storedImageUrl]);

    
    useEffect(() => {
        if ((!searchTerm && searchType !== 'image') || (searchType === 'image' && !imgSrc)) {
            return;
        }
        
        if (isFilterEmpty() && order == '') {
            fetchSearchResults();
        } else {
            HandleFilter();
        }
    }, [searchTerm, imgSrc, currentPage, searchParams, searchType, order]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) return <ErrorPage message={error} statusCode={404} />;

    return (
        isItemsReturned ? (
            <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="flex relative">
                <SearchFilter HandleFilter={HandleFilter} formData={filter} setFormData={setFilter} />
                <div className="flex flex-col justify-between w-full">
                    <ItemDisplay Items={items} Favourited={favourited} HandleFilter={HandleFilter} user_id={user_id} setOrder={setOrder} order={order} />
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
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold text-gray-600">No items found matching this {searchType === 'image' ? 'photo' : 'term:'} {searchTerm}</h1>
            </div>
        )
    )
}
export default SearchPage;