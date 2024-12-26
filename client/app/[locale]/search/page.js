'use client';
import { use, useEffect, useState } from 'react';
import SearchFilter from "./SearchFilter";
import { useSearchParams } from 'next/navigation';
import ItemDisplay from "./ItemDisplay";
import Loading from '@/app/[locale]/global_components/loading';


const SearchPage = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('term') || '';
    const searchType = searchParams.get('type');
    const [imgSrc, setImgSrc] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isItemsReturned, setisItemsReturned] = useState(false);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const fetchSearchResults = async () => {
        if (!searchTerm && searchType !== 'image'){ 
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
                endpoint = `http://localhost:8080/imageDesc/search-by-image?page=${currentPage}&pageSize=${itemsPerPage}`;
                if (!imgSrc){ console.log("there's no URL"); return;}
                options.method = 'POST';
                options.body = JSON.stringify({ image:imgSrc });
            } else {
                endpoint = `http://localhost:8080/search?term=${encodeURIComponent(searchTerm)}&page=${currentPage}&pageSize=${itemsPerPage}`;
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


    useEffect(() => {
        console.log('Search type:', searchType);
        if (searchType === 'image') {
            const storedImageUrl = localStorage.getItem('searchImageUrl');
            console.log('Stored image URL:', storedImageUrl);
            if (storedImageUrl) {
                setImgSrc(storedImageUrl);
                localStorage.removeItem('searchImageUrl');
                console.log('Removed image URL from localStorage');
            }
        }
        fetchSearchResults();
    }, [searchTerm, imgSrc, currentPage,searchParams, searchType]);

    if (isLoading) {
            return <Loading>Creating Listing....</Loading>;
    }

    
    return (
        isItemsReturned ? (
            <div className="flex relative">
                <SearchFilter />
                <div className="flex flex-col justify-between w-full">
                    <ItemDisplay Items={items} Favourited={[]}/>
                    <div className="flex justify-center items-center space-x-2 my-4">
                        {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === index + 1
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
            <div className="flex justify-center items-center h-96"> 
                <h1 className="text-2xl">No items found matching this {searchType === 'image' ? 'photo' : 'term:'} {searchTerm}</h1>
            </div>
        )
    )
}
export default SearchPage;