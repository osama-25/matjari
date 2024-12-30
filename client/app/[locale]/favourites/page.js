'use client';
import React, { useEffect, useState } from "react";
import FavTopNav from "./TopNav";
import { HomeItem } from "../Item";
import { getInfo } from '../global_components/dataInfo';
import Loading from "../global_components/loading";
import ErrorPage from "../ErrorPage";

const Profile = () => {
    const [favorites, setFavorites] = useState([]); 
    const [user_id, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await getInfo();
                if (info) {
                    console.log("Fetched user info:", info); // Debug log
                    setUserId(info.id);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);
    
    useEffect(() => {
        console.log("Fetching favorites for user_id:", user_id); // Debug log
        setLoading(true);
        const fetchFavorites = async () => {
            if (!user_id) return;
    
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }
                const data = await response.json();
                setFavorites(data.favorites);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchFavorites();
    }, [user_id]);

    if (loading) {
        return <Loading />
    }
    if(error) return <ErrorPage message={error} statusCode={400} />;

    return (
        <>
            <FavTopNav />
            <section className="flex flex-col gap-4 m-4 md:m-8 rounded-md">
                {favorites.length > 0 ? (
                    favorites.map(item => (
                        <HomeItem 
                            key={item.id} 
                            id={item.id} 
                            name={item.title} 
                            image={item.photo_url || '/default-image.jpg'} // Fallback to a default image
                            price={`$${item.price}`} 
                            chatid={item.id} 
                            desc={item.description || "No description available"} 
                            heart={true} // Always true for favorite items
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">You have no favorite items yet.</p>
                )}
            </section>
        </>
    );
};

export default Profile;
