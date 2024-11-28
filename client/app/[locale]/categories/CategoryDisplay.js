import Link from "next/link";
import React from "react";

export const CategoryAd = ({ text, bg, img, link }) => (
    <div className="w-full overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center bg-gray-200 rounded-sm">
            {/* Text Section */}
            <div className="flex flex-col w-2/5 gap-2 p-2 md:p-10">
                <p className="text-sm md:text-4xl font-bold">{text}</p>
                <p className="text-xs sm:text-sm md:text-2xl">{text}</p>
            </div>

            {/* Image Section */}
            <div className="w-3/5 flex justify-end">
                <img
                    src={img}
                    className="object-fill"
                    alt="Ad"
                />
            </div>
        </div>
    </div>
);


const SubCategory = ({ id, img, name }) => (
    <div className="hover:underline cursor-pointer flex flex-col items-center">
        <div className="w-20 h-20 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-52 lg:h-52 bg-gray-50 p-4 border hover:border-gray-400 transition-all ease-in-out items-center flex">
            <img src={img} />
        </div>
        <p className="text-xs md:text-lg text-center">{name}</p>
    </div>
);

const CategoryDisplay = ({ categories }) => {
    return (
        <>
            <p className="text-3xl mb-4">Shop by category</p>
            <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-6 justify-center">
                {categories.map((cat, index) => (
                    <SubCategory img={cat.image} name={cat.name} key={index} id={cat.id} />
                ))}
            </div>
        </>
    )
}
export default CategoryDisplay