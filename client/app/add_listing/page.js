"use client"; 

import Link from "next/link";
import React, { useState } from "react";
import AddPhoto from "./AddPhoto";

const Listing = () => {
    const [photos, setPhotos] = useState([1,2,3]); // Initially Three Images
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photosURL,setURL]=useState([]);
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState([]);
    const [newDetailKey, setNewDetailKey] = useState('');
    const [newDetailValue, setNewDetailValue] = useState('');
    
    const addPhoto = () => {
        setPhotos([...photos, photos.length + 1]); 
    };//  add a new Image

    const addPhotoURL=(url)=>{
        setURL([...photosURL,url]);
    };

    const deletePhotoURL = (id) => {
        const updatedPhotos = photosURL.filter((url, index) => index !== id);
        //setURL(updatedPhotos);
    };

    return (
        <div className="flex justify-center items-center p-10 bg-gray-100 min-h-screen">
            <div className="w-full flex flex-col gap-4 ml-16">

                <div className="w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='categories' className="text-gray-700 text-xl font-bold">Category</label>
                    <div className="p-4">
                        <select id="categories"  value={category} onChange={(e) => setCategory(e.target.value)} className="w-96 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none">
                            <option selected>Choose a category</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                    <div className="p-4">
                        <select id="subcat" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}  className="w-96 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none">
                            <option selected>Choose a sub-category</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>
                
                <div className="w-3/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='photo' className="text-gray-700 text-xl font-bold">Add photos</label>
                    <div id="photo" className="grid grid-cols-6 gap-2 w-11/12 p-4">
                        {photos.map((photo, index) => (
                            <AddPhoto key={index} id={index} onDelete={deletePhotoURL} onUpload={addPhotoURL}/>
                        ))}
                        <button 
                            onClick={addPhoto} 
                            className=" bg-gray-200 flex items-center justify-center rounded-lg shadow hover:bg-gray-300"
                            style={{ width: '124px', height: '128px' }}
                        >
                            +
                        </button>
                    </div>
                </div>
                
                <div className="w-2/4 bg-white p-4 rounded-lg gap-y-4 shadow-lg">
                    <label className="text-gray-700 text-xl font-bold mb-2">Description</label>
                    <div className="p-4">
                        <label htmlFor='title' className="block text-gray-700 text-md font-bold">Title</label>
                        <input
                            type="text"
                            name='title'
                            id='title'
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="p-4">
                        <label htmlFor='desc' className="block text-gray-700 text-md font-bold">Write a brief description about your listing</label>
                        <textarea
                            type="text"
                            name='desc'
                            id='desc'
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            className="shadow-inner border-2 rounded w-full min-h-16 max-h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>
                
                <div className="w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label className="text-gray-700 text-xl font-bold">Listing details</label>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">Condition</label>
                        <div className="flex gap-x-4">
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name='condition'
                                    id='new'
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='new' className="text-gray-700 text-md">New</label>
                            </div>
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name='condition'
                                    id='used'
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='used' className="text-gray-700 text-md">Used</label>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <label className="text-gray-700 text-md font-bold">Delivery</label>
                        <div className="flex gap-x-4">
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name='delivery'
                                    id='yes'
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='yes' className="text-gray-700 text-md">Yes</label>
                            </div>
                            <div className="m-2 flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    name='delivery'
                                    id='no'
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <label htmlFor='no' className="text-gray-700 text-md">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='price' className="text-gray-700 text-xl font-bold">Price (JD)</label>
                    <div className="p-4">
                        <input
                            type="number"
                            name='price'
                            id='price'
                            min={0}
                            className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>
                
                <div className="w-2/4 bg-white p-4 rounded-lg shadow-lg">
                    <label htmlFor='location' className="text-gray-700 text-xl font-bold">Location</label>
                    <div className="p-4">
                        <select id="location" className="w-96 h-12 border-2 border-gray-300 text-gray-600 rounded-lg px-2 focus:outline-none">
                            <option selected>Choose a country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listing;
