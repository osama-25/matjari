// Listing.js
'use client';

import React, { useState, useEffect } from "react";
import { getInfo } from "../global_components/dataInfo";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorPage from "../ErrorPage";
import CustomDetails from "../add_listing/CustomDetail";
import AddPhoto from "../add_listing/AddPhoto";
import Loading from "../global_components/loading";
import { FaArrowLeft } from "react-icons/fa6";

const EditListing = () => {
    const searchParams = useSearchParams();
    const itemID = searchParams.get('id');
    const [photos, setPhotos] = useState([1, 2, 3]);
    const [customDetails, setCustomDetails] = useState([]);
    const [photoDataArray, setPhotoDataArray] = useState([]); // Track photo data as state
    const [formData, setFormData] = useState({
        category: "",
        sub_category: "",
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
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState(null);
    const [error, setError] = useState();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // To manage loading state
    const [images, setImages] = useState([]); // Initialize images state with photoDataArray



    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchCat();
    }, []);

    useEffect(() => {
        const fetchSubCat = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${formData.category}`);
                const data = await response.json();
                setSubCategories(data || []);
            } catch (error) {
                setError(error.message);
            }
        }
        if (formData.category) {
            fetchSubCat();
        }
    }, [formData.category]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await getInfo();
                if (info) {
                    setFormData(prev => ({ ...prev, userID: info.id }));
                }
                else {
                    throw new Error("Failed to fetch profile info");
                }
            } catch (error) {
                setError(error.message);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchItemInfo = async () => {
            setLoading(true);
            try {
                console.log("item id: " + itemID);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/${itemID}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(data);
                setFormData(data);
                setCustomDetails(data.customDetails);
                setPhotoDataArray(data.photos.map(photo => ({
                    imageBase64: photo
                })));
                //setImages(data.photos);
            } catch (error) {
                //console.error("Error fetching item:", error);
                setError(error.message); // Set error state
            } finally {
                setLoading(false);
            }
        };
        fetchItemInfo();
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
            if (photo.filename) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/azure/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            filename: photo.filename,
                            fileType: photo.fileType,
                            imageBase64: photo.imageBase64.split(",")[1],
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
            else {
                uploadedUrls.push(photo.imageBase64);
            }
        }

        return uploadedUrls;
    };

    const formCheck = () => {
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                throw new Error(`${key} is required`);
            }
        });
    }

    const removeEmptyDetails = () => {
        const filteredDetails = customDetails.filter(
            (detail) => detail.title.trim() !== "" && detail.description.trim() !== ""
        );
        setCustomDetails(filteredDetails);

        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => {
                // Exclude unwanted keys or empty values
                // For example, exclude 'unwantedKey' or any empty strings, null, or undefined values
                const unwantedKeys = ['email', 'id', 'phone_number', 'username', 'photos', 'customDetails']; // Define the keys you want to remove
                return !unwantedKeys.includes(key);
            })
        );

        setFormData(cleanedData);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            removeEmptyDetails();
            formCheck();

            // First upload all photos and get their URLs
            const uploadedPhotoUrls = await uploadPhotos();
            console.log("uploadedPhotoUrls: ", uploadedPhotoUrls);
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/update/${itemID}`, {
                method: 'POST', // POST request to edit
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update listing: ${errorText}`);
            }

            const data = await response.json();
            console.log('Listing updated successfully:', data);
            alert('Listing updated successfully!');

            // Clear the form and photo data
            setPhotoDataArray([]);
            setPhotos([1, 2, 3]); // Reset to initial state
            setCustomDetails([]);
            setFormData({
                category: "",
                sub_category: "",
                title: "",
                description: "",
                condition: "",
                delivery: "",
                price: "",
                location: "",
                userID: formData.userID, // Preserve the user ID
                listingId: "" // Clear the listing ID after update
            });
            router.push(`/item/${itemID}`);

        } catch (error) {
            console.error('Error during submission:', error);
            alert(`Failed to update listing: ${error.message}`);
        }finally {
            setLoading(false);
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

    if (error) {
        return <ErrorPage message={error} statusCode={404} />
    }

    // Show loading state while fetching data
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex justify-center items-center sm:p-6 min-h-screen">
            <button
                onClick={() => router.push('/')}
                className="absolute top-5 left-5 p-2 sm:p-8 text-lg cursor-pointer"
            >
                <FaArrowLeft size={26} />
            </button>
            <form
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                className="w-full flex flex-col justify-center items-center gap-6 bg-white rounded-lg max-w-6xl p-4 sm:p-6"
                onSubmit={handleSubmit}
            >
                <p onClick={HandleLocaleChange}
                    className={`absolute ${locale == 'ar' ? 'left-0' : 'right-0'} top-0 p-8 text-lg cursor-pointer`}>
                    {locale == 'ar' ? 'EN' : 'عربي'}
                </p>
                <h1 className="text-3xl font-bold my-6">{t('edittitle')}</h1>
                <div className="w-full flex flex-col-reverse sm:flex-row">
                    {/* Left Column */}
                    <div className="space-y-2 p-4">
                        {/* Category Section */}
                        <div>
                            <label htmlFor="categories" className="block text-gray-700 text-lg font-bold">
                                {t('category')}
                            </label>
                            <select
                                id="categories"
                                name="category"
                                className="w-full mt-2 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-3 focus:outline-none"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('categoryph')}</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.name}>
                                        {t(category.name)}
                                    </option>
                                ))}
                            </select>
                            {/* Subcategory Section */}
                            {subcategories && <select
                                data-testid="subcat"
                                id="subcat"
                                name="sub_category"
                                className="w-full mt-2 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-3 focus:outline-none"
                                value={formData.sub_category}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('subcatph')}</option>
                                {subcategories.map((subcategory, index) => (
                                    <option key={index} value={subcategory.name}>
                                        {t(subcategory.name)}
                                    </option>
                                ))}
                            </select>}
                        </div>
                        {/* Info Section */}
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="title" className="block text-gray-700 text-lg font-bold">
                                    {t('title')}
                                </label>
                                <input
                                    data-testid="title"
                                    type="text"
                                    name="title"
                                    placeholder={t('titleph')}
                                    id="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 h-12 border-2 border-gray-300 rounded-lg px-3 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="desc" className="block text-gray-700 text-lg font-bold">
                                    {t('desc')}
                                </label>
                                <textarea
                                    data-testid="description"
                                    name="description"
                                    placeholder={t('descph')}
                                    id="desc"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 py-2 h-24 border-2 border-gray-300 rounded-lg px-3 focus:outline-none"
                                />
                            </div>
                        </div>
                        {/* Price Section */}
                        <div>
                            <label htmlFor="price" className="block text-gray-700 text-lg font-bold">
                                {t('price')}
                            </label>
                            <input
                                data-testid="price"
                                type="number"
                                name="price"
                                id="price"
                                placeholder={t('priceph')}
                                min={0}
                                step={0.01}
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full mt-2 h-12 border-2 border-gray-300 rounded-lg px-3 focus:outline-none"
                            />
                        </div>
                        {/* Location Section */}
                        <div>
                            <label htmlFor="location" className="block text-gray-700 text-lg font-bold">
                                {t('location')}
                            </label>
                            <select
                                id="location"
                                name="location"
                                className="w-full mt-2 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-3 focus:outline-none"
                                value={formData.location}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('locationph')}</option>
                                <option value="Amman">{t('Amman')}</option>
                                <option value="Irbid">{t('Irbid')}</option>
                                <option value="Az Zarqa">{t('Az Zarqa')}</option>
                                <option value="Ajlun">{t('Ajlun')}</option>
                                <option value="Al Tafilah">{t('Al Tafilah')}</option>
                                <option value="Al Mafraq">{t('Al Mafraq')}</option>
                                <option value="Maan">{t('Maan')}</option>
                                <option value="Al Aqaba">{t('Al Aqaba')}</option>
                                <option value="Jerash">{t('Jerash')}</option>
                                <option value="Madaba">{t('Madaba')}</option>
                                <option value="Al Karak">{t('Al Karak')}</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="text-gray-700 text-lg font-bold">{t('details')}</label>
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
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Photos Section */}
                        <div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 justify-items-center">
                                <div className="col-span-2 md:col-span-3 w-full">
                                    <AddPhoto image={photoDataArray[0]?.imageBase64 || null} key={0} id={0} onDelete={deletePhotoURL} onUpload={addPhotoURL} size="large" />
                                </div>
                                {photos.map((photo, index) => (
                                    <AddPhoto image={photoDataArray[index + 1]?.imageBase64 || null} key={index + 1} id={index + 1} onDelete={deletePhotoURL} onUpload={addPhotoURL} size="small" />
                                ))}
                                {images.length < 9 && (
                                    <button
                                        type="button"
                                        onClick={addPhoto}
                                        className="w-24 h-24 md:w-26 md:h-26 lg:w-36 lg:h-36 bg-gray-200 flex items-center justify-center rounded-lg text-3xl shadow hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-2 flex justify-center mt-6">
                    <button
                        data-testid="submitBtn"
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-3 px-6 rounded-lg focus:outline-none"
                    >
                        {t('submit')}
                    </button>
                </div>
            </form>
        </div >
    );
};

export default EditListing;
