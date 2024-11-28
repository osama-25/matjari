'use client';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const AdDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('Home');
  const pathname = usePathname();

  const images = [
    { text: t('banner1'), img: 'https://matjariblob.blob.core.windows.net/ads/electronics-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', bg: 'bg-blue-700' },
    { text: t('banner2'), img: 'https://matjariblob.blob.core.windows.net/ads/health%26beauty-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', bg: 'bg-green-700' },
    { text: t('banner3'), img: 'https://matjariblob.blob.core.windows.net/ads/videogames-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', bg: 'bg-purple-700' },
    { text: t('banner4'), img: 'https://matjariblob.blob.core.windows.net/ads/womensfashion-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', bg: 'bg-red-700' },
    { text: t('banner5'), img: 'https://matjariblob.blob.core.windows.net/ads/home-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', bg: 'bg-orange-700' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative overflow-hidden mx-4 my-2 rounded-md">
      {/* Image Container */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-none w-full flex justify-between items-center ${image.bg}`}
          >
            <div className="flex flex-col w-2/5 justify-center items-center gap-6 p-10">
              <p dir={pathname.split('/')[1] == 'ar'? 'rtl': 'ltr'} className="text-white text-xl md:text-4xl font-bold text-center">
                {image.text}
              </p>
            </div>
            <div className="w-3/5 flex justify-center">
              <img
                src={image.img}
                className="w-full object-scale-down md:object-fill rounded-md"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full cursor-pointer border-2 ${index === currentIndex ? 'border-gray-800' : 'border-white'
              }`}
          ></div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute top-0 left-0 w-1/12 h-full bg-gray-800 bg-opacity-0 hover:bg-opacity-10 text-white flex items-center justify-start pl-4 transition-all"
      >
        <FaArrowLeft className="text-2xl" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-0 right-0 w-1/12 h-full bg-gray-800 bg-opacity-0 hover:bg-opacity-10 text-white flex items-center justify-end pr-4 transition-all"
      >
        <FaArrowRight className="text-2xl" />
      </button>
    </div>
  );
};

export default AdDisplay;
