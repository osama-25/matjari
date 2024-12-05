"use client";
import React, { use, useEffect, useState } from "react";
import CategoryDisplay, { CategoryAd } from "../CategoryDisplay";
import { HomeItem, Item } from "@/app/[locale]/Item";
import { useTranslations } from "next-intl";
import ErrorPage from "../../ErrorPage";
import Loading from "../../global_components/loading";

const ads = [
    { category: 'electronics', img: 'https://matjariblob.blob.core.windows.net/ads/electronics-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'electronics-ad' },
    { category: 'mensfashion', img: 'https://matjariblob.blob.core.windows.net/ads/mensfashion-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'mensfashion-ad' },
    { category: 'womensfashion', img: 'https://matjariblob.blob.core.windows.net/ads/womensfashion-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'womensfashion-ad' },
    { category: 'kids', img: 'https://matjariblob.blob.core.windows.net/ads/kids-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'kids-ad' },
    { category: 'homekitchen', img: 'https://matjariblob.blob.core.windows.net/ads/home-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'home-ad' },
    { category: 'healthbeauty', img: 'https://matjariblob.blob.core.windows.net/ads/health%26beauty-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'beauty-ad' },
    { category: 'videogames', img: 'https://matjariblob.blob.core.windows.net/ads/videogames-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'videogames-ad' },
    { category: 'pets', img: 'https://matjariblob.blob.core.windows.net/ads/pets-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'pets-ad' },
    { category: 'sportsfitness', img: 'https://matjariblob.blob.core.windows.net/ads/sports-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'sports-ad' },
    { category: 'cars', img: 'https://matjariblob.blob.core.windows.net/ads/cars-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'cars-ad' },
    { category: 'properties', img: 'https://matjariblob.blob.core.windows.net/ads/properties-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: 'properties-ad' }
];

export default function SubCateg({ params }) {
    const category = use(params).slug;
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [error, setError] = useState(null);
    const ad = ads.find(ad => ad.category === category);
    const t = useTranslations('ads');

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await fetch(`http://localhost:8080/categories/${category}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.statusText}`);
                }
                const data = await response.json();
                setCategories(data || []);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCat();
    }, [category]);

    useEffect(()=>{
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:8080/categories/${category}/${currentPage}/${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch items: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setItems(data.items || []);
            } catch (error) {
                console.log(error);
                setError(error.message);
            }
        };

        fetchItems();
    },[currentPage])

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (error) {
        return <ErrorPage message={error} statusCode={404} />;
    }

    if (!ad) {
        return <Loading />;
    }

    // Paginate items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <div>
                <CategoryAd img={ad.img} text={t(ad.text)} />
            </div>
            <div className="p-5">
                <CategoryDisplay categories={categories} />
                <p className="mb-4 mt-8 text-3xl">Other</p>
                <div className="flex flex-col gap-y-5">
                    {currentItems.map(item => (
                        <HomeItem key={item.id} item={item} image={item.image} />
                    ))}
                </div>

                <div className="flex justify-center items-center space-x-2 mt-4">
                    {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
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
    );
}
