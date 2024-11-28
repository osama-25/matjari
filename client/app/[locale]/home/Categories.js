import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";



export const CategoryDisplay = ({ text, bg, img, link }) => {
    const t = useTranslations('Home');
    const pathname = usePathname();
    return (
        <div className="w-full px-4 py-2">
            <div className={`w-full flex flex-col sm:flex-row justify-between items-center ${bg} rounded-md`}>
                <div dir={pathname.split('/')[1] == 'ar' ? 'rtl' : 'ltr'} className="flex flex-col w-full sm:w-2/5 justify-center md:items-center gap-6 p-10">
                    <p className="text-white md:text-center text-2xl sm:w-full md:text-3xl font-bold">{text}</p>
                    <Link
                        className="lg:text-md text-center bg-white hover:bg-gray-200 w-fit md:w-full lg:w-2/5 font-bold py-2 px-4 rounded-3xl"
                        href={link}
                    >
                        {t('adbutton')}
                    </Link>
                </div>
                <div className="w-full sm:w-3/5 flex justify-center">
                    <img
                        src={img}
                        className="object-fill"
                    />
                </div>
            </div>
        </div>
    )
}

const CategoryItem = ({ name, image, link }) => (
    <a href={link} className="flex flex-col items-center hover:underline">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-2 bg-gray-200">
            <img src={image} alt={name} className="w-9/12" />
        </div>
        <p className="text-center text-sm">{name}</p>
    </a>
);

const Categories = () => {
    const t = useTranslations('Home');
    const categories = [
        { id: 1, name: t("category1"), image: "/Resources/electronics.png", link: "/categories/electronics" },
        { id: 2, name: t("category2"), image: "/Resources/mensfashion.png", link: "/categories/mensfashion" },
        { id: 3, name: t("category3"), image: "/Resources/womensfashion.png", link: "/categories/womensfashion" },
        { id: 4, name: t("category4"), image: "/Resources/kids.png", link: "/categories/kids" },
        { id: 5, name: t("category5"), image: "/Resources/kitchen.png", link: "/categories/homekitchen" },
        { id: 6, name: t("category6"), image: "/Resources/beauty.png", link: "/categories/healthbeauty" },
        { id: 7, name: t("category7"), image: "/Resources/videogames.png", link: "/categories/videogames" },
        { id: 8, name: t("category8"), image: "/Resources/pets.png", link: "/categories/pets" },
        { id: 9, name: t("category9"), image: "/Resources/sports.png", link: "/categories/sportsfitness" },
        { id: 10, name: t("category10"), image: "/Resources/cars.png", link: "/categories/cars" },
        { id: 11, name: t("category11"), image: "/Resources/properties.png", link: "/categories/properties" },
    ];
    const pathname = usePathname();
    const locale = pathname.split("/")[1];

    return (
        <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
            {categories.map(category => (
                <CategoryItem key={category.id} name={category.name} image={category.image} link={category.link} />
            ))}
        </div>
    )
}
export default Categories