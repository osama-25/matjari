// Listing.js
'use client';

import React, { useState } from "react";
import CustomDetails from "../add_listing/CustomDetail";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Listing = () => {
    const [customDetails, setCustomDetails] = useState([{ title: 'condition', description: 'yes' }]);
    const [formData, setFormData] = useState({
        category: "",
        subCategory: "",
        title: "",
        description: "",
        condition: "",
        delivery: "",
        price: "",
        location: ""
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        console.log("Custom Details:", customDetails);
        // You can now use `formData` and `customDetails` to send the data to an API or process it as needed
    };

    return (
        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
            <form dir={locale == 'ar'? 'rtl':'ltr'} className="w-full flex flex-col md:items-start items-center gap-4 md:ml-16" onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold place-self-center mb-4">{t('edittitle')}</h1>
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
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Edit
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
