// Listing.js
'use client';

import React, { useState } from "react";
import AddPhoto from "./AddPhoto";
import CustomDetails from "./CustomDetail";

const Listing = () => {
    const [photos, setPhotos] = useState([1, 2, 3]); // Initially Three Images
    const [customDetails, setCustomDetails] = useState([]);
    const [photosURL,setURL]=useState([]);
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
    
    //  add a new Image
    const addPhoto = () => {
        if(photos.length < 12) setPhotos([...photos, photos.length + 1]);
    };

    const addPhotoURL=(url)=>{
        setURL([...photosURL,url]);
    };

    const deletePhotoURL = (id) => {
        const updatedPhotos = photosURL.filter((url, index) => index !== id);
        //setURL(updatedPhotos);
    };
    return (
        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
            <form className="w-full flex flex-col md:items-start items-center gap-4 md:ml-16" onSubmit={handleSubmit}>
                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='categories' className="text-gray-700 text-xl font-bold">Category</label>
                    <div className="p-4">
                        <select
                            id="categories"
                            name="category"
                            className="w-full h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="">Choose a category</option>
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
                            <option value="">Choose a sub-category</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>
                
                <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-lg">
                    <label className="text-gray-700 text-xl font-bold">Add photos</label>
                    <div id="photo" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 justify-items-center gap-2 lg:w-11/12 p-4">
                        {photos.map((photo, index) => (
                            <AddPhoto key={index} />
                        ))}
                        {photos.length < 12 && <button
                            onClick={addPhoto}
                            className=" bg-gray-200 flex items-center justify-center rounded-lg text-3xl shadow hover:bg-gray-300"
                            style={{ width: '124px', height: '128px' }}
                        >
                            +
                        </button>}
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg gap-y-4 shadow-lg">
                    <label className="text-gray-700 text-xl font-bold mb-2">Description</label>
                    <div className="p-4">
                        <label htmlFor='title' className="block text-gray-700 text-md font-bold">Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Add a title"
                            id='title'
                            value={formData.title}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="p-4">
                        <label htmlFor='desc' className="block text-gray-700 text-md font-bold">Write a brief description about your listing</label>
                        <textarea
                            name="description"
                            placeholder="Add a description"
                            id='desc'
                            value={formData.description}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full min-h-16 max-h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label className="text-gray-700 text-xl font-bold">Listing Details</label>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">Condition</label>
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
                                <label htmlFor='new' className="text-gray-700 text-md">New</label>
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
                                <label htmlFor='used' className="text-gray-700 text-md">Used</label>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">Do you provide delivery?</label>
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
                                <label htmlFor='yes' className="text-gray-700 text-md">Yes</label>
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
                                <label htmlFor='no' className="text-gray-700 text-md">No</label>
                            </div>
                        </div>
                    </div>
                    <CustomDetails customDetails={customDetails} setCustomDetails={setCustomDetails} />
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='price' className="text-gray-700 text-xl font-bold">Price (JD)</label>
                    <div className="p-4">
                        <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder="Add a price"
                            min={0}
                            value={formData.price}
                            onChange={handleInputChange}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='location' className="text-gray-700 text-xl font-bold">Location</label>
                    <div className="p-4">
                        <select
                            id="location"
                            name="location"
                            className="w-full h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none"
                            value={formData.location}
                            onChange={handleInputChange}
                        >
                            <option value="">Choose your location</option>
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
                        List
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Listing;
