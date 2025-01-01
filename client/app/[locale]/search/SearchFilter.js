'use client';
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaFilter, FaXmark } from "react-icons/fa6";

const SearchFilter = ({ HandleFilter, formData, setFormData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("Search");

    const toggleFilter = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('calling handlefilter')
        HandleFilter(formData);
        // Perform search or filter action with formData
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={toggleFilter}
                className="absolute top-6 left-6 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition md:hidden z-50"
            >
                <FaFilter size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={toggleFilter}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                ></div>
            )}
            <form onSubmit={handleSubmit} className={`fixed inset-y-0 left-0 bg-white md:bg-transparent flex flex-col p-6 w-full max-w-sm transform transition-transform duration-300 z-50 md:relative md:transform-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{t('filter')}</h3>
                    <button
                        onClick={toggleFilter}
                        className="text-black md:hidden"
                    >
                        <FaXmark size={24} />
                    </button>
                </div>
                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">{t('price')}</h4>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center">
                            <span className="w-24 text-gray-600">{t('min')}</span>
                            <input
                                type="number"
                                name="minPrice"
                                value={formData.minPrice}
                                onChange={handleChange}
                                className="ml-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="0"
                            />
                        </label>
                        <label className="flex items-center">
                            <span className="w-24 text-gray-600">{t('max')}</span>
                            <input
                                type="number"
                                name="maxPrice"
                                value={formData.maxPrice}
                                onChange={handleChange}
                                className="ml-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="1000"
                            />
                        </label>
                    </div>
                </div>

                {/* City */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">{t('location')}</h4>
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
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

                {/* Delivery */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">{t('delivery')}</h4>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="delivery"
                                value="Yes"
                                checked={formData.delivery === 'Yes'}
                                onChange={handleChange}
                                className="mx-2"
                            />
                            {t('yes')}
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="delivery"
                                value="No"
                                checked={formData.delivery === 'No'}
                                onChange={handleChange}
                                className="mx-2"
                            />
                            {t('no')}
                        </label>
                    </div>
                </div>

                {/* Condition */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 text-gray-700">{t('condition')}</h4>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="condition"
                                value="New"
                                checked={formData.condition === 'New'}
                                onChange={handleChange}
                                className="mx-2"
                            />
                            {t('new')}
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="condition"
                                value="Used"
                                checked={formData.condition === 'Used'}
                                onChange={handleChange}
                                className="mx-2"
                            />
                            {t('used')}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                    {t('apply')}
                </button>
            </form>
        </div>
    );
};

export default SearchFilter;