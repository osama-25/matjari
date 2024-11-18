"use client";
import { useEffect, useState } from "react";
import ImageUploader from "../global_components/images/ImageUploader";
import ImageDisplay from "../global_components/images/ImageDisplay";

const ImageUploadPage = () => {
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

  const handleUploadSuccess = (uploadedImage) => {
    console.log("Upload successful, refreshing...");
    setRefreshKey((prevKey) => prevKey + 1); // Increment refresh key to trigger re-render
  };

  useEffect(() => {
    // You can use this useEffect to handle any side-effects or cleanups
  }, [refreshKey]); // Dependency on refreshKey will cause this to run whenever it changes

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Image Upload</h2>
      <ImageUploader onUploadSuccess={handleUploadSuccess} />
      <ImageDisplay key={refreshKey} /> {/* Trigger re-render of ImageDisplay when refreshKey changes */}
    </div>
  );
};

export default ImageUploadPage;
