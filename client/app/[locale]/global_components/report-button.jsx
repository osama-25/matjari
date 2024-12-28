"use client"

import React, { useState } from "react";
import ReportModal from "./report"; // Updated import path

const ReportButton = ({ userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                Report an Issue
            </button>
            {isModalOpen && (
                <ReportModal isOpen={isModalOpen} onClose={closeModal}
                    userId={userId} />
            )}
        </>
    );
};

const ReportPage = ({ userId }) => {
    return (
        <div
        // className="min-h-screen bg-gray-100 flex items-center justify-center"
        >
            <ReportButton
                userId={userId}
            />
        </div>
    );
};

export default ReportPage;
