"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';

export default function AdminItemsPage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/fetch-all-items`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    return (

        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">All Items</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">{item.title}</h2>
                            <p>{item.description}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Sub-Category:</strong> {item.sub_category || 'N/A'}</p>
                            <p><strong>Condition:</strong> {item.condition}</p>
                            <p><strong>Delivery:</strong> {item.delivery}</p>
                            <p><strong>Price:</strong> {item.price}</p>
                            <p><strong>Location:</strong> {item.location}</p>
                            {/* Add photos if available */}
                            {item.photos && item.photos.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.photos.map((photo, index) => (
                                        <img key={index} src={photo} alt={item.title} className="w-20 h-20 object-cover rounded" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
