import React from 'react';

const AdDisplay = ({ imageUrl, altText, link }) => {
  return (
    <div className="w-full px-4 py-2">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt={altText} className="w-full h-54 object-cover rounded-md" />
      </a>
    </div>
  );
};
export default AdDisplay