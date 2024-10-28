"use client";

import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
const ResetPassword = () => {
    const router = useRouter();

    // const { token } = router.query;
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setDone(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/reset-password', {
                token,
                newPassword,
            });
            console.log(response.data);
            setDone(true);
            setMessage(response.data.message || 'Password successfully reset!');

            // useRouter().push('/login');
            router.push('/login');
        } catch (error) {
            setDone(false);
            setMessage(error.response?.data?.error || 'Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Reset Password
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center text-sm ${done ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
