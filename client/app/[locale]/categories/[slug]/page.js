'use client';
import React, { use, useEffect, useRef, useState } from "react";
import SearchFilter from "../SearchFilter";
import ItemDisplay from "../ItemDisplay";
import CategoryDisplay, { CategoryAd } from "../CategoryDisplay";
import { HomeItem, Item } from "@/app/[locale]/Item";

const FCategories = [
    { id: 1, name: 'Men Fashiom', image: '/favicon.ico', link: '/electronics' },
    { id: 2, name: 'Women Fashion', image: '/favicon.ico', link: '/fashion' },
    { id: 3, name: 'Children Fashion', image: '/favicon.ico', link: '/home' },
];

const ECategories = [
    { id: 1, name: 'Mobiles', image: '/favicon.ico', link: '/electronics' },
    { id: 2, name: 'Tablets', image: '/favicon.ico', link: '/fashion' },
    { id: 3, name: 'Tv', image: '/favicon.ico', link: '/home' },
    { id: 4, name: 'Chargers', image: '/favicon.ico', link: '/books' },
];

const items = [
    { id: 1, name: 'Mobile phones', image: '/Resources/womenshirt.png' },
    { id: 2, name: 'Laptops', image: '/Resources/womenpants.png' },
    { id: 3, name: 'Tablets', image: '/Resources/womenjackets.png' },
    { id: 4, name: 'Smart watches', image: '/Resources/womenuw.png' },
    { id: 5, name: 'Headphones', image: '/Resources/womenhoodie.png' },
    { id: 6, name: 'Speakers', image: '/Resources/heels.png' },
    { id: 7, name: 'Cameras', image: '/Resources/womenhat.png' },
    { id: 8, name: 'Tv & Screens', image: '/Resources/womenglasses.png' },
    { id: 9, name: 'Cameras', image: '/Resources/womenwatches.png' },
    { id: 10, name: 'Tv & Screens', image: '/Resources/handbag.png' },
    { id: 11, name: 'Tv & Screens', image: '/Resources/jewelry.png' },
    { id: 12, name: 'Tv & Screens', image: '/Resources/dress.png' },
];

export default function SubCateg({ params }) {
    const SubCategories = use(params).slug == 'electronics' ? ECategories : FCategories;
    const [isPressed, setIsPressed] = useState(false);
    const searchFilterRef = useRef(null);

    const toggleOverlay = () => {
        setIsPressed(!isPressed);
    }

    useEffect(() => {
        if (false) { // check the subcategory in the database
            //SubCategories = SubCategories; // assign the right subcategory array
        }

        //items = items; // assign the items array with the correct items according to the search or category
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchFilterRef.current && !searchFilterRef.current.contains(event.target)) {
                setIsPressed(false);
            }
        };

        if (isPressed) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPressed]);

    return (
        <div>
            <div className="">
                <CategoryAd
                    img={'https://matjariblob.blob.core.windows.net/ads/pets-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D'}
                    text={'Welcome to the world of tech'}
                    link={''}
                />
            </div>
            <div className="p-5">
                <CategoryDisplay categories={items} />
                <p className="mb-3 mt-8 text-3xl">Other</p>
                <div className="flex flex-col gap-y-5">
                    {items.map((item, index) => (
                        <HomeItem
                            key={index}
                            id={item.id} name={item.name} image={item.image}
                            price={'59.99'} heart={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}