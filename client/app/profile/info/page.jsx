"use client"; // Ensure this component runs on the client side

import React, { useState, useEffect } from "react";
import Loading from "../loading";

const Info = () => {
    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage errors
    // const [_token, setTokne] = useState(null); // To manage errors

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true); // Start loading

            // await new Promise(s => setTimeout(s, 3000));
            try {
                const token = localStorage.getItem('token'); // Adjust based on where your token is stored
                // _token = tokne;
                console.log("token: " + token);

                if (!token) {
                    console.log("No token found");
                    return;
                }

                const response = await fetch("http://localhost:8080/profile/data", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile info");
                }

                const data = await response.json(); // Parse the JSON response
                console.log(data);

                const user = data.user;

                setInfo({
                    firstName: user.fname,
                    lastName: user.lname,
                    email: user.email,
                    username: user.user_name
                });
            } catch (error) {
                console.error("Error fetching profile info:", error);
                setError(error.message); // Set error state
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchInfo(); // Call the async function
    }, []); // Run once on mount

    // Show loading state while fetching data
    if (loading) {
        return <Loading />;
    }

    // Show error message if there was an error
    if (error) {
        return (
            <section className="border rounded border-gray-300 mt-10 p-2">
                <div className="text-center text-red-500">ERROR: {error} </div>
                <h1 className="m-2 font-bold flex items-end justify-center">Please login first</h1>
                <p> </p>
            </section>
        )

    }


    return (
        <section className="border rounded border-gray-300 mt-10 p-2">
            <h1 className="m-2 font-bold">Profile Info</h1>

            <>
                <form onSubmit={(e) => { e.preventDefault(); setIsDisabled(true); }}>
                    <div className="grid grid-cols-2">
                        <div className="m-2">
                            <label htmlFor='firstname' className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                            <input
                                disabled={isDisabled}
                                type="text"
                                name='firstname'
                                id='firstname'
                                value={info.firstName}
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
                                value={info.lastName}
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                            />
                        </div>
                        <div className="m-2">
                            <label htmlFor='username' className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input
                                disabled={isDisabled}
                                type="username"
                                name='username'
                                id='username'
                                value={info.username}
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
                                value={info.email}
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
            </>
        </section>
    );
};

export default Info;
