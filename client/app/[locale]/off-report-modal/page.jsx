"use client"

import React, { useState } from "react";
import ReportModal from "../global_components/report"; // Updated import path

const ReportButton = () => {
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
                <ReportModal isOpen={isModalOpen} onClose={closeModal} />
            )}
        </>
    );
};

const ReportPage = () => {
    return (
        <div
        // className="min-h-screen bg-gray-100 flex items-center justify-center"
        >
            <ReportButton />
        </div>
    );
};

export default ReportPage;
