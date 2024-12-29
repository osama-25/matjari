"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const ImageDisplay = () => {
    const [imageData, setImageData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/img/images`);
                const data = response.data;
                setImageData(data);
                console.log(data);
            } catch (err) {
                setError("Error loading image");
                console.error(err);
            }
        }

        fetchImage();
    }, []);

    if (error) {
        return <p className="text-red-500 font-semibold">{error}</p>;
    }

    return (
        <div className="mt-6">
            {imageData.length > 0 ? (
                imageData.map((image, index) => (
                    <div
                        key={index}
                        className="shadow-lg rounded-lg p-4 bg-white max-w-sm mx-auto mb-4"
                    >
                        <h3 className="text-lg font-semibold mb-2">{image.filename}</h3>
                        <p className="text-gray-600 mb-4">Type: {image.fileType}</p>
                        <img
                            src={image.img_url}
                            alt={image.filename}
                            className="rounded-lg w-full h-auto"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Uploaded on: {new Date(image.uploadDate).toLocaleString()}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Loading images...</p>
            )}
        </div>
    );
};

export default ImageDisplay;
