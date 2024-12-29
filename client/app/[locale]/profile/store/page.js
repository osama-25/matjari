'use client';
import { Item } from "@/app/[locale]/Item";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { getInfo } from "../../global_components/dataInfo";
import Loading from "../../global_components/loading";
import ErrorPage from "../../ErrorPage";

const Store = () => {
    const t = useTranslations('Profile');
    const [items, setItems] = useState(null);
    const [user_id, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, SetError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getInfo();
                if (user) {
                    setUserId(user.id);
                }
            } catch (error) {
                SetError(error.message);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        // Fetch items
        const fetchItems = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/store/${user_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch items: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setItems(data.listings);
            } catch (error) {
                SetError(error.message);
            }
        };
        if (user_id) {
            fetchItems();
        }
    }, [user_id]);

    if (error) return <ErrorPage statusCode={404} message={error.message} />;

    if (!items) return <Loading>Loading...</Loading>;

    return (
        <section className="border rounded border-gray-300 p-2 flex flex-col h-full">
            <h1 className="m-2 font-bold">{t('store')}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center overflow-y-auto flex-grow">
                {items.map(item => (
                    <Item
                        id={item.id}
                        key={item.id}
                        name={item.title}
                        image={item.image}
                        price={item.price}
                        hideFav={true}
                    />
                ))}
            </div>
        </section>
    );
}
export default Store