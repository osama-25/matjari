'use client';
import React, { useEffect, useState } from "react";
import { Item } from "../Item";
import { useTranslations } from "next-intl";
import { getInfo } from "../global_components/dataInfo";

const ItemsDisplay = ({ items }) => {
    const t = useTranslations('Home');
    const [user_id, setUserId] = useState(null);
    const [favourited, setFavourited] = useState([]);

    useEffect(() => {
        // Fetch user information
        const fetchUser = async () => {
            try {
                const info = await getInfo();
                if (info) {
                    setUserId(info.id);
                }
            } catch (error) {
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        // Fetch favourited items only if user_id is available
        const fetchFavourited = async () => {
            if (!user_id) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/batch/${user_id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch favourited state');
                }

                const data = await response.json();

                setFavourited(data.favorites);
            } catch (error) {
                console.error("Error fetching favourites:", error.message);
            }
        };
        fetchFavourited();
    }, [user_id]);

    return (
        <div className="flex flex-col px-6 py-2">
            {/* Scrollable Items Section */}
            <div className="grid grid-cols-2 sm:flex sm:space-x-10 overflow-y-auto mt-2 no-scrollbar">
                {items.map(item => (
                    <Item
                        key={item.id}
                        id={item.id}
                        name={item.title}
                        image={item.image}
                        price={item.price}
                        heart={favourited.includes(item.id)}
                        hideFav={item.user_id === user_id}
                    />
                ))}
            </div>
        </div>
    );
};
export default ItemsDisplay;
