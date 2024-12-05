"use client"; // Ensure this component runs on the client side

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getInfo, modifyData } from "../../global_components/dataInfo";
import Loading from "../../global_components/loading";
import Popup from "../../popup";
import { useTranslations } from "next-intl";

function ProfilePicture({ pic, togglePopup }) {
    return (
        <div className="relative w-full h-40 flex justify-center items-end">
            {/* Profile Picture as Edit Button */}
            <img
                src={pic}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full cursor-pointer object-cover"
                onClick={togglePopup} // Clicking on the photo triggers the edit popup
            />
        </div>
    );
}


const Info = () => {

    const [info, setInfo] = useState({
        fname: '',
        lname: '',
        email: '',
        user_name: '',
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage errors
    const [originalInfo, setOriginalInfo] = useState(null); // To manage errors
    // const [_token, setToken] = useState(null); // To manage errors
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState('/Resources/profile-pic.jpg');
    const t = useTranslations('Profile');

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const changeProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Only PNG, JPEG, and JPG files are allowed');
                e.target.value = ''; // Clear the input
            }
            else {
                setPhoto(URL.createObjectURL(file));
                // save the photo in the user row in the database
            }
        }
    }


    function handleOnChange(event) {

        const { name, value } = event.target;
        setInfo(
            preInfo => {

                return {
                    ...preInfo,
                    [name]: value,
                }
            }
        )
    }

    function handleOnCancle() {

        // console.log(originalInfo);

        setInfo(originalInfo);
        setIsDisabled(true);
        // setInfo(oldInfo);
    }

    function handleOnSave() {

        modifyData(info);
        setOriginalInfo(info);
        setIsDisabled(true);
    }

    function handleOnEdit() {

        // edit info in the database
        setOriginalInfo(info);
        setIsDisabled(false)
    }

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true); // Start loading
            // await new Promise(s => setTimeout(s, 3000));

            try {
                const user = await getInfo();
                if (!user) {
                    setError(true);
                    throw new Error("Failed to fetch profile info");
                    return;
                }

                setOriginalInfo(user);



                setInfo({
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    user_name: user.user_name
                });

            } catch (error) {
                setError(error.message); // Set error state
            }
            finally {
                setLoading(false);
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
            <section className="border rounded-lg border-red-400 bg-red-50 shadow-md mt-10 p-5 max-w-lg mx-auto">
                <div className="text-center text-red-600 font-bold text-xl">
                    ERROR: {error}
                </div>
                {/* <h1 className="m-4 text-lg font-bold flex items-center justify-center text-gray-800">
                    Please login first
                </h1> */}
                <p className="flex justify-center">
                    <Link href="/login" className="text-white mt-7 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-all ease-in-out">
                        Try Login
                    </Link>
                </p>
            </section>
        )
    }


    return (
        <section className="flex flex-col h-full border rounded border-gray-300 p-4 md:p-6 overflow-y-auto">
            {/* Profile Picture Section */}
            <ProfilePicture pic={photo} togglePopup={togglePopup} />

            {/* Profile Info Header */}
            <h1 className="m-2 font-bold">{t('info')}</h1>

            {/* Form Section */}
            <form onSubmit={(e) => { e.preventDefault(); setIsDisabled(true); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="m-2">
                        <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">{t('firstname')}</label>
                        <input
                            disabled={isDisabled}
                            type="text"
                            name="fname"
                            id="fname"
                            value={info.fname}
                            onChange={handleOnChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">{t('lastname')}</label>
                        <input
                            disabled={isDisabled}
                            type="text"
                            name="lname"
                            id="lname"
                            value={info.lname}
                            onChange={handleOnChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">{t('user')}</label>
                        <input
                            disabled={isDisabled}
                            type="text"
                            name="user_name"
                            id="user_name"
                            value={info.user_name}
                            onChange={handleOnChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>

                    <div className="m-2">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('email')}</label>
                        <input
                            disabled={isDisabled}
                            type="email"
                            name="email"
                            id="email"
                            value={info.email}
                            onChange={handleOnChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="m-2">
                        <label htmlFor="phonenumber" className="block text-gray-700 text-sm font-bold mb-2">{t('number')}</label>
                        <input
                            disabled={isDisabled}
                            type="tel"
                            pattern="[6-7]{1}[5789]{1}-[0-9]{3}-[0-9]{4}"
                            name="phonenumber"
                            id="phonenumber"
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                {/* Save and Cancel Buttons */}
                {!isDisabled && (
                    <div className="flex w-full items-center justify-center mt-4 gap-x-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                            onClick={handleOnSave}
                        >
                            {t('save')}
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            type="button"
                            onClick={() => setIsDisabled(true)}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                )}
            </form>

            {/* Edit Button */}
            {isDisabled && (
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={handleOnEdit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {t('edit')}
                    </button>
                </div>
            )}

            {/* Popup for Profile Picture */}
            {isOpen && (
                <Popup title={t('photo')} togglePopup={togglePopup}>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={changeProfilePic}
                        className="mt-4"
                    />
                </Popup>
            )}
        </section>
    );
};

export default Info;
