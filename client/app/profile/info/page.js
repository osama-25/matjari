'use client';
import React, { useState } from "react";

const Info = () => {
    const [isDisabled, setIsDisabled] = useState(true);

    return (
        <section className="border rounded border-gray-300 mt-10 p-2">
            <h1 className="m-2 font-bold">Profile Info</h1>
            <form onSubmit={() => setIsDisabled(true)}> {/* edit the onsubmit to edit info */}
                <div className="grid grid-cols-2">
                    <div className="m-2">
                        <label htmlFor='firstname' className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                        <input
                            disabled={isDisabled}
                            type="text"
                            name='firstname'
                            id='firstname'
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor='lastname' className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                        <input
                            disabled={isDisabled}
                            type="text"
                            name='lastname'
                            id='lastname'
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor='phonenumber' className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                        <input
                            disabled={isDisabled}
                            type="tel"
                            pattern="[6-7]{1}[5789]{1}-[0-9]{3}-[0-9]{4}"
                            name='phonenumber'
                            id='phonenumber'
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor='email' className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            disabled={isDisabled}
                            type="email"
                            name='email'
                            id='email'
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>
                <div className={`${isDisabled ? 'hidden' : 'block'} flex items-end justify-center mt-4`}>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
            <div className={`${isDisabled ? 'block' : 'hidden'} flex items-end justify-center mt-4`}>
                <button
                    onClick={() => setIsDisabled(false)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Edit
                </button>
            </div>
        </section>
    );
}
export default Info