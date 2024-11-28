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
  const [randomBanner, setRandomBanner] = useState(null);
  const t = useTranslations('Home');

  const banners = [
    { bg: 'bg-blue-800', img: 'https://matjariblob.blob.core.windows.net/ads/shoes-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad1'), link: '/categories/mensfashion' },
    { bg: 'bg-red-700', img: 'https://matjariblob.blob.core.windows.net/ads/handbag-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad2'), link: '/categories/womensfashion' },
    { bg: 'bg-purple-700', img: 'https://matjariblob.blob.core.windows.net/ads/games-ad.png?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-17T16:46:50Z&st=2024-11-17T08:46:50Z&spr=https&sig=w%2Fj73uiro1P%2B2kPc4gvxyeykWKEz1N9X4jpsk6Vyv2Y%3D', text: t('ad3'), link: '/categories/videogames' },
  ]
  useEffect(() => {
    // Select random banner only on the client side
    setRandomBanner(banners[Math.floor(Math.random() * banners.length)]);
  }, []);

  return (
    <>
      <NavBar />
      <AdDisplay />
      <Categories />
      {randomBanner != null &&
        <CategoryDisplay bg={randomBanner.bg} img={randomBanner.img} text={randomBanner.text} link={randomBanner.link} />
      }
      <ItemsDisplay />
      <Footer />

      {/* <Button onClick={handleClick}> Testing Something </Button> */}
    </>
  );
}
