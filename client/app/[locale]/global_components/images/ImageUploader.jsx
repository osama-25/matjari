"use client";

import axios from "axios";
import { useState } from "react";

const ImageUploader = ({ onUploadSuccess }) => {
    const [imageBase64, setImageBase64] = useState("");
    const [filename, setFilename] = useState("");
    const [fileType, setFileType] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFilename(file.name);
            setFileType(file.type);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setImageBase64(base64String);
            };
        }
    };

    const handleUpload = async () => {
        if (!imageBase64 || !filename || !fileType) {
            alert("Please select an image to upload.");
            return;
        }

        // try {
        //     const response = await axios.post("${process.env.NEXT_PUBLIC_API_URL}/azure/upload", {
        //         filename,
        //         fileType,
        //         imageBase64,
        //     });
        //     alert("Image uploaded successfully: " + response.data.imgURL);
        //     if (onUploadSuccess) onUploadSuccess(response.data);
        // } catch (error) {
        //     console.error("Error uploading image:", error);
        //     alert("Error uploading image");
        // }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/azure/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename,
                    fileType,
                    imageBase64,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            alert("Image uploaded successfully: " + data.imgURL);

            if (onUploadSuccess) onUploadSuccess(data);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image");
        }

    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-indigo-600 file:text-white
        hover:file:bg-indigo-700"
            />
            <button
                onClick={handleUpload}
                className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
            >
                Upload Image
            </button>
        </div>
    );
};

export default ImageUploader;
