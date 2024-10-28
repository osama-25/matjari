'use client';
import Popup from "@/app/popup";
import React, { useState } from "react";

const DeleteAcc = () => {
    const [popup, setPopup] = useState(false);
    const Handledelete = () => {
        setPopup(!popup);
    }

    return (
        <section className="flex flex-col items-center border rounded border-gray-300 mt-10 p-2">
            <p className="mb-6 text-gray-600 text-sm font-bold">
                Once you delete your account, all your data will be permanently removed. This action cannot be undone.
            </p>
            <button onClick={Handledelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete Account
            </button>
            {
                popup &&
                <Popup togglePopup={Handledelete} title={'Confirm Deletion'}>
                    <p>Are you sure you want to delete your account?</p>
                    <div className="flex justify-center gap-x-2 mt-4">
                        <button className="w-32 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">
                            Yes
                        </button>
                        <button className="w-32 shadow-lg hover:bg-gray-200 py-1 px-4 rounded">
                            No
                        </button>
                    </div>
                </Popup>
            }
        </section>
    );
}
export default DeleteAcc