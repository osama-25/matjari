// Listing.js
'use client';

import React, { useState, useEffect } from "react";
import AddPhoto from "./AddPhoto";
import CustomDetails from "./CustomDetail";
import { getInfo } from "../global_components/dataInfo";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const Listing = () => {
    const [photos, setPhotos] = useState([1, 2, 3]);
    const [customDetails, setCustomDetails] = useState([]);
    const [photoDataArray, setPhotoDataArray] = useState([]); // Track photo data as state
    const [photosURL, setPhotosURL] = useState([]); // Track URLs as state
    const [formData, setFormData] = useState({
        category: "",
        subCategory: "",
        title: "",
        description: "",
        condition: "",
        delivery: "",
        price: "",
        location: "",
        userID: ""
    });
    const t = useTranslations('Listing');
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const router = useRouter();

    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const info = await getInfo();
            if (info) {
                setFormData(prev => ({ ...prev, userID: info.id }));
            }
        };
        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const uploadPhotos = async () => {
        const uploadedUrls = [];

        for (const photo of photoDataArray) {
            try {
                const response = await fetch("http://localhost:8080/azure/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        filename: photo.filename,
                        fileType: photo.fileType,
                        imageBase64: photo.imageBase64,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error uploading photo: ${photo.filename}`);
                }

                const result = await response.json();
                if (result.imgURL) {
                    uploadedUrls.push(result.imgURL);
                } else {
                    throw new Error('No image URL received from server');
                }
            } catch (error) {
                console.error("Error uploading photo:", error);
                throw error; // Propagate error to handle it in the main submission
            }
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First upload all photos and get their URLs
            const uploadedPhotoUrls = await uploadPhotos();

            if (uploadedPhotoUrls.length === 0) {
                throw new Error('No photos were successfully uploaded');
            }

            // Prepare the payload with the uploaded photo URLs
            const payload = {
                ...formData,
                photos: uploadedPhotoUrls,
                customDetails: customDetails.reduce((acc, detail) => ({
                    ...acc,
                    [detail.title]: detail.description
                }), {})
            };

            // Send the listing data to the backend
            const response = await fetch('http://localhost:8080/api/listing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create listing: ${errorText}`);
            }

            const data = await response.json();
            console.log('Listing created successfully:', data);
            alert('Listing created successfully!');

            // Clear the form and photo data
            setPhotoDataArray([]);
            setPhotosURL([]);
            setPhotos([1, 2, 3]); // Reset to initial state
            setCustomDetails([]);
            setFormData({
                category: "",
                subCategory: "",
                title: "",
                description: "",
                condition: "",
                delivery: "",
                price: "",
                location: "",
                userID: formData.userID // Preserve the user ID
            });

        } catch (error) {
            console.error('Error during submission:', error);
            alert(`Failed to create listing: ${error.message}`);
        }
    };

    const addPhoto = () => {
        if (photos.length < 12) setPhotos([...photos, photos.length + 1]);
    };

    const addPhotoURL = (filename, fileType, imageBase64) => {
        setPhotoDataArray(prev => [...prev, { filename, fileType, imageBase64 }]);
    };

    const deletePhotoURL = (id) => {
        setPhotoDataArray(prev => prev.filter((_, index) => index !== id));
    };

    return (
        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
            <form dir={locale == 'ar' ? 'rtl' : 'ltr'} className="w-full flex flex-col md:items-start items-center gap-4 md:ml-16" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold place-self-center mb-4">{t('addtitle')}</h1>
                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='categories' className="text-gray-700 text-xl font-bold">{t('category')}</label>
                    <div className="p-4">
                        <select
                            id="categories"
                            name="category"
                            className="w-full h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="">{t('categoryph')}</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                    <div className="p-4">
                        <select
                            id="subcat"
                            name="subCategory"
                            className="w-full h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none"
                            value={formData.subCategory}
                            onChange={handleInputChange}
                        >
                            <option value="">{t('subcatph')}</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>

                <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-lg">
                    <label className="text-gray-700 text-xl font-bold">{t('photos')}</label>
                    <div id="photo" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 justify-items-center gap-2 lg:w-11/12 p-4">
                        {photos.map((photo, index) => (
                            <AddPhoto key={index} id={index} onDelete={deletePhotoURL} onUpload={addPhotoURL} />
                        ))}
                        {photos.length < 12 && <button
                            type="button"
                            onClick={addPhoto}
                            className="w-24 h-24 md:w-26 md:h-26 lg:w-32 lg:h-32 bg-gray-200 flex items-center justify-center rounded-lg text-3xl shadow hover:bg-gray-300"
                        >
                            +
                        </button>}
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg gap-y-4 shadow-lg">
                    <label className="text-gray-700 text-xl font-bold mb-2">{t('info')}</label>
                    <div className="p-4">
                        <label htmlFor='title' className="block text-gray-700 text-md font-bold">{t('title')}</label>
                        <input
                            type="text"
                            name="title"
                            placeholder={t('titleph')}
                            id='title'
                            value={formData.title}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="p-4">
                        <label htmlFor='desc' className="block text-gray-700 text-md font-bold">{t('desc')}</label>
                        <textarea
                            name="description"
                            placeholder={t('descph')}
                            id='desc'
                            value={formData.description}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full min-h-16 max-h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label className="text-gray-700 text-xl font-bold">{t('details')}</label>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">{t('condition')}</label>
                        <div className="flex gap-x-4">
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name="condition"
                                    id="new"
                                    value="New"
                                    checked={formData.condition === "New"}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='new' className="text-gray-700 text-md">{t('condition1')}</label>
                            </div>
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name="condition"
                                    id="used"
                                    value="Used"
                                    checked={formData.condition === "Used"}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='used' className="text-gray-700 text-md">{t('condition2')}</label>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">{t('delivery')}</label>
                        <div className="flex gap-x-4">
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name="delivery"
                                    id="yes"
                                    value="Yes"
                                    checked={formData.delivery === "Yes"}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='yes' className="text-gray-700 text-md">{t('delivery1')}</label>
                            </div>
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name="delivery"
                                    id="no"
                                    value="No"
                                    checked={formData.delivery === "No"}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='no' className="text-gray-700 text-md">{t('delivery2')}</label>
                            </div>
                        </div>
                    </div>
                    <CustomDetails customDetails={customDetails} setCustomDetails={setCustomDetails} />
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='price' className="text-gray-700 text-xl font-bold">{t('price')}</label>
                    <div className="p-4">
                        <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder={t('priceph')}
                            min={0}
                            value={formData.price}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='location' className="text-gray-700 text-xl font-bold">{t('location')}</label>
                    <div className="p-4">
                        <select
                            id="location"
                            name="location"
                            className="w-full h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none"
                            value={formData.location}
                            onChange={handleInputChange}
                        >
                            <option value="">{t('locationph')}</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>

                <div className="self-center py-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {t('submit')}
                    </button>
                </div>
            </form>
            <p onClick={HandleLocaleChange}
                className={`absolute ${locale == 'ar' ? 'left-0' : 'right-0'} top-0 p-8 text-lg cursor-pointer`}>
                {locale == 'ar' ? 'EN' : 'عربي'}
            </p>
        </div>
    );
};

export default Listing;
