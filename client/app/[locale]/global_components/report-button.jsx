"use client"

import React, { useState } from "react";
import ReportModal from "./report"; // Updated import path
import { FaCircleExclamation } from "react-icons/fa6";

const ReportButton = ({ userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
                <FaCircleExclamation size={24} />
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
