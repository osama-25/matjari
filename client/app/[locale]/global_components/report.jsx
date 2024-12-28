"use client";

import React, { useState } from "react";
import axios from 'axios';


const Report = ({ isOpen, onClose, userId }) => {

    console.log("userId in the report: " + userId);
    const [description, setDescription] = useState("");
    const [errorType, setErrorType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/admin/submit-report', { description, errorType, userId });
            console.log("Report submitted:", { description, errorType, userId });
            // Clear form after submission
            setDescription("");
            setErrorType("");
            if (onClose) onClose(); // Ensure onClose is called if it exists
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">Report an Issue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="errorType"
                            className="block text-sm font-medium text-blue-700"
                        >
                            Error Type
                        </label>
                        <select
                            id="errorType"
                            value={errorType}
                            onChange={(e) => setErrorType(e.target.value)}
                            className="mt-2 block w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Select an error type
                            </option>
                            <option value="UI Bug">UI Bug</option>
                            <option value="Functional Error">Functional Error</option>
                            <option value="Performance Issue">Performance Issue</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-blue-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue..."
                            className="mt-2 block w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
                    >
                        Submit Report
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Report;
