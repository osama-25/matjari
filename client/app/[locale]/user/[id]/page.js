'use client';
import React, { use, useEffect, useState } from 'react';
import ErrorPage from '../../ErrorPage';
import { Item } from '../../Item';
import Loading from '../../global_components/loading';
import { getInfo } from '../../global_components/dataInfo';

const UserPage = ({ params }) => {
    const id = use(params).id;
    const [user, setUser] = useState({
        user_name: "",
        listings: null
    });
    const [photo, setPhoto] = useState('/Resources/profile-pic.jpg');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user_id, setUserId] = useState(null);
    const [favourited, setFavourited] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const data = await response.json();
                console.log('User data:');
                console.log(data);
                setUser(data);
                setPhoto(data.photo || '/Resources/profile-pic.jpg');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserInfo();
    }, [id]);

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

    if (loading) return <Loading />;

    if (error) return <ErrorPage message={error} statusCode={404} />;

    return (
        <div className="w-full p-6">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="flex flex-col items-center mb-4 gap-y-4">
                    <img
                        src={photo}
                        alt={`${user.user_name} profile`}
                        className="w-40 h-40 md:w-60 md:h-60 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{user.user_name}</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center overflow-y-auto flex-grow">
                    {user.listings.map(item => (
                        <Item
                            id={item.id}
                            key={item.id}
                            name={item.title}
                            image={item.image}
                            price={item.price}
                            heart={favourited.includes(item.id)}
                            hideFav={user_id == item.user_id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserPage;