"use client";
import NavBar from "./NavBar";
import Categories, { CategoryDisplay } from "./Categories";
import ItemsDisplay from "./ItemsDisplay";
import AdDisplay from "./AdDisplay";
import React, { useEffect, useState } from "react";
import Popup from "../popup";
import Link from "next/link";
import Footer from "../footer";
import { useTranslations } from "next-intl";

export default function Home() {
  const [items, setItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [randomBanner, setRandomBanner] = useState(null);
  const t = useTranslations('Home');

  const banners = [
    { bg: 'bg-blue-800', img: 'https://matjariblob.blob.core.windows.net/ads/shoes-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad1'), link: '/subcategories/Shoes', ad: 'Shoes' },
    { bg: 'bg-red-700', img: 'https://matjariblob.blob.core.windows.net/ads/handbag-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad2'), link: '/subcategories/Handbags', ad: 'Handbags' },
    { bg: 'bg-purple-700', img: 'https://matjariblob.blob.core.windows.net/ads/games-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad3'), link: '/subcategories/Games', ad: 'Games' },
    { bg: 'bg-gray-500', img: 'https://matjariblob.blob.core.windows.net/ads/phones-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad4'), link: '/subcategories/Mobile Phones', ad: 'Mobile Phones' },
  ]
  useEffect(() => {
    // Select random banner only on the client side
    setRandomBanner(banners[Math.floor(Math.random() * banners.length)]);
    // retrieve latest seen items
    setLatestItems(JSON.parse(localStorage.getItem("latestSeenItems")) || []);
  }, []);

  useEffect(() => {
    // Fetch items
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${randomBanner.ad}/1/6`);
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`);
        }
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };
    if (randomBanner) {
      fetchItems();
    }
  }, [randomBanner]);

  return (
    <>
      <NavBar />
      <AdDisplay />
      <Categories />
      {latestItems.length > 0 &&
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mt-4 px-4">{t('recent')}</h1>
          <ItemsDisplay items={latestItems} />
        </div>
      }
      {randomBanner &&
        <CategoryDisplay bg={randomBanner.bg} img={randomBanner.img} text={randomBanner.text} link={randomBanner.link} />
      }{randomBanner &&
        <ItemsDisplay items={items} />
      }
      <Footer />

      {/* <Button onClick={handleClick}> Testing Something </Button> */}
    </>
  );
}
