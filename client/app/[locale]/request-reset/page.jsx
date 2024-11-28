"use client";

import { useState } from 'react';
import axios from 'axios';

const RequestReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/request-password-reset', { email });
            setMessage(response.data.message || 'Check your email for the reset link.');
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Password Reset</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send Reset Link
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RequestReset;
