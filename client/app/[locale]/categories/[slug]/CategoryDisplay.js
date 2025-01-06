import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export const CategoryAd = ({ text, img }) => (
    <div className="w-full overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center bg-gray-200 rounded-sm">
            {/* Text Section */}
            <div className="flex flex-col w-2/5 gap-2 p-2 md:p-10">
                <p className="text-sm md:text-4xl font-bold">{text}</p>
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


const SubCategory = ({ img, name }) => {
    const t = useTranslations("Listing");
    return (
        <div className="hover:underline cursor-pointer flex flex-col items-center">
            <Link href={`/subcategories/${name}`} className="w-20 h-20 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-52 lg:h-52 bg-gray-50 p-4 border hover:border-gray-400 transition-all ease-in-out items-center flex">
                <img src={img} className="object-contain w-full h-full" />
            </Link>
            <p className="text-xs md:text-lg text-center">{t(name)}</p>
        </div>
    );
}

const CategoryDisplay = ({ categories }) => {
    return (
        <div className="p-5">
            <p className="text-3xl mb-4">Shop by category</p>
            <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-6 justify-center">
                {categories.map((cat, index) => (
                    <SubCategory img={cat.image} name={cat.name} key={index} parent={cat.parent_cat} />
                ))}
            </div>
        </div>
    )
}
export default CategoryDisplay