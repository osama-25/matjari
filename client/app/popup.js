import React, { useState } from "react";
import { FaX, FaXmark } from "react-icons/fa6";

const Popup = ({ children, title, togglePopup }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
                <div className="flex justify-between items-center gap-2 mb-4">
                    <h2 className="text-2xl">{title}</h2>
                    <button onClick={togglePopup} className="shadow-md rounded-full w-6 h-6 flex justify-center items-center">
                        <FaXmark />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
export default Popup