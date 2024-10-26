'use client';
import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

const CustomDetails = ({ customDetails, setCustomDetails }) => {
    const addCustomDetail = () => {
        setCustomDetails([...customDetails, { title: "", description: "" }]);
    };

    const handleDetailChange = (index, field, value) => {
        const newDetails = [...customDetails];
        newDetails[index][field] = value;
        setCustomDetails(newDetails);
    };

    const removeDetail = (index) => {
        const newDetails = customDetails.filter((_, i) => i !== index);
        setCustomDetails(newDetails);
    };

    return (
        <div className="w-full p-4">
            {customDetails.map((detail, index) => (
                <div key={index} className="relative flex flex-col md:flex-row mb-2 gap-1">
                    <input
                        type="text"
                        placeholder="Detail Title"
                        value={detail.title}
                        onChange={(e) => handleDetailChange(index, "title", e.target.value)}
                        className="shadow-inner border-2 rounded w-1/2 md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400 mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Detail Description"
                        value={detail.description}
                        onChange={(e) => handleDetailChange(index, "description", e.target.value)}
                        className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                    />
                    <button onClick={() => removeDetail(index)} className="absolute md:relative right-0">
                        <IoCloseCircle size={24} color="red" />
                    </button>
                </div>
            ))}
            <button
                onClick={addCustomDetail}
                className="mt-4 text-white bg-blue-500 px-4 py-2 rounded-lg"
            >
                + Add Custom Detail
            </button>
        </div>
    );
};

export default CustomDetails;
