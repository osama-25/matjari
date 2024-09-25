import React from "react";

const DeleteAcc = () => {
    return (
        <section className="flex flex-col items-center border rounded border-gray-300 mt-10 p-2">
            <p className="mb-6 text-gray-600 text-sm font-bold">
                Once you delete your account, all your data will be permanently removed. This action cannot be undone.
            </p>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete Account
            </button>
        </section>
    );
}
export default DeleteAcc