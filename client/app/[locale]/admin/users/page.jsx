"use client";
import { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/get-users'); // Adjust if using a different API route
                const data = await response.json();
                console.log(data);

                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    const banUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/ban-user/${userId}`, {
                method: 'POST', // Use 'PUT' or 'DELETE' if your API requires it
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update the user's banned status in the UI
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, banned: true } : user
                    )
                );
                alert('User has been banned successfully');
            } else {
                alert('Failed to ban user');
            }
        } catch (error) {
            console.error('Error banning user:', error);
            alert('An error occurred while banning the user');
        }
    };

    const unbanUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/unban-user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update the user's banned status in the UI
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, banned: false } : user
                    )
                );
                alert('User has been unbanned successfully');
            } else {
                alert('Failed to unban user');
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('An error occurred while unbanning the user');
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8">Users</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-center">User Name</th>
                            <th className="py-3 px-6 text-center">Phone Number</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {users.map(user => (
                            <tr
                                key={user.id}
                                className={`border-b border-gray-200 hover:bg-gray-100 ${user.banned ? 'bg-red-100 text-red-600' : ''
                                    }`}
                            >

                                <td className="py-3 px-6 text-left">{`${user.id}`}</td>
                                <td className="py-3 px-6 text-left">{`${user.fname} ${user.lname}`}</td>
                                <td className="py-3 px-6 text-left">{user.email}</td>
                                <td className="py-3 px-6 text-left">{user.user_name}</td>
                                <td className="py-3 px-6 text-left">{user.phone_number || 'N/A'}</td>
                                <td className="py-3 px-6 text-center">
                                    {!user.banned ? (
                                        <button
                                            onClick={() => banUser(user.id)}
                                            className="text-red-500 hover:text-red-700 ml-4"
                                        >
                                            Ban User
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => unbanUser(user.id)}
                                            className="text-green-500 hover:text-green-700 ml-4"
                                        >
                                            Unban User
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
