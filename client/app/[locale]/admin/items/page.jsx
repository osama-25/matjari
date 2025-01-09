"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';
import { useSearchParams } from 'next/navigation';

export default function AdminItemsPage() {
    const [item, setItem] = useState(null);
    const searchParams = useSearchParams();
    const itemID = searchParams.get('id');

    useEffect(() => {
        const fetchItem = async () => {
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/${itemID}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }

                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.log(error.message);
            }
        }
        if (itemID) {
            fetchItem();
        }
    }, [itemID]);

    const deleteItem = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/delete/${itemID}`, {
                method: 'DELETE', // Explicitly set the method to DELETE
            });
            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }
            router.push('/reports');
        } catch (error) {
            setError(error);
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                {item ? (
                    <div className="bg-white p-4 rounded shadow relative">
                        <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
                        <p>{item.description}</p>
                        <p><strong>Category:</strong> {item.category}</p>
                        <p><strong>Sub-Category:</strong> {item.sub_category || 'N/A'}</p>
                        <p><strong>Condition:</strong> {item.condition}</p>
                        <p><strong>Delivery:</strong> {item.delivery}</p>
                        <p><strong>Price:</strong> {item.price}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>User:</strong> {item.username}</p>
                        <p><strong>User email:</strong> {item.email}</p>
                        {/* Add photos if available */}
                        {item.photos && item.photos.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.photos.map((photo, index) => (
                                    <img key={index} src={photo} alt={item.title} className="w-20 h-20 object-cover rounded" />
                                ))}
                            </div>
                        )}
                        <button
                            onClick={deleteItem}
                            className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Item
                        </button>
                    </div>
                ) : (
                    <p>Loading item...</p>
                )}
            </div>
        </AdminLayout>
    );
}
