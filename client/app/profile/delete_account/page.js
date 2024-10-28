"use client";

import React, { useState } from "react";

const DeleteAcc = () => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        setShowModal(true);
    };

    const confirmDelete = () => {
        setShowModal(false);
        // Add your delete account logic here, e.g., API call
        console.log("Account deleted");
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <section className="flex flex-col items-center border rounded border-gray-300 mt-10 p-2">
            <p className="mb-6 text-gray-600 text-sm font-bold">
                Once you delete your account, all your data will be permanently removed. This action cannot be undone.
            </p>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
            >
                Delete Account
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Confirm Deletion
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DeleteAcc;
