'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const HomeItem = ({ name, image, id, price, heart }) => {
    const [Heart, setHeart] = useState(heart);
    const router = useRouter();

    const handleHeartClick = (event) => {
        event.stopPropagation();
        setHeart(!Heart);
    }

    const HandleItemClick = (event) => {
        event.stopPropagation();
        router.push(`/item/${id}`);
    }

    return (
        <div className="flex flex-row gap-2">
            <div
                onClick={HandleItemClick}
                className="rounded-lg bg-gray-100 p-2 cursor-pointer relative"
            >
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-52 md:h-52 relative overflow-hidden rounded-md">
                    <img
                        src={image}
                        className="object-contain w-full h-full"
                    />
                    <button
                        onClick={handleHeartClick}
                        className="absolute top-1 right-1 w-7 h-7 hover:bg-gray-100 bg-white rounded-full flex items-center justify-center shadow"
                    >
                        {Heart ? <FaHeart size={16} color="crimson" className="w-full" /> : <FaRegHeart size={16} className="w-full" />}
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-between w-full py-1 px-3">
                <div className="flex flex-col gap-3">
                    <Link
                        href={`/item/${id}`}
                        className="break-words sm:w-3/4 overflow-hidden w-full"
                    >
                        <p className="text-sm md:text-xl hover:underline cursor-pointer">{name}</p>
                    </Link>
                    <span className="text-sm md:text-2xl font-bold">{price} JD</span>
                </div>
            </div>
        </div>
    );
};

export const Item = ({ id, name, image, price, heart }) => {
    const [Heart, setHeart] = useState(heart);

    const handleHeartClick = (event) => {
        event.stopPropagation();
        setHeart(!Heart);
    }

    return (
        <div className="flex flex-col rounded-md gap-2 m-2">
            <Link href={`/item/${id}`} className="w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-lg bg-gray-100 p-2 cursor-pointer">
                <img src={image} alt={name} className="object-contain w-full h-full rounded-lg" />
            </Link>
            <Link href={`/item/${id}`} className="break-words w-full sm:w-3/4 overflow-hidden p-1">
                <p className="text-sm hover:underline cursor-pointer">{name}</p>
            </Link>
            <div className="flex w-full justify-between items-center">
                <span className="text-sm">{price}</span>
                <button onClick={handleHeartClick} className="w-7 h-7 hover:bg-gray-100 rounded-full flex flex-row items-center justify-center shadow">
                    {Heart ? <FaHeart size={16} color={'crimson'} /> : <FaRegHeart size={16} />}
                </button>
            </div>
        </div>
    );
}