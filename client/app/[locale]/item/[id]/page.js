'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { FaArrowLeft, FaArrowRight, FaComment, FaHeart, FaPen, FaRegHeart } from 'react-icons/fa';
import Loading from '@/app/[locale]/global_components/loading';
import { useTranslations } from 'next-intl';
import ErrorPage from '../../ErrorPage';
import { getInfo } from '../../global_components/dataInfo';
import { FaTrashCan } from 'react-icons/fa6';
import Popup from '../../popup';
import Link from 'next/link';

const details = [
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
    { title: 'Location', desc: 'Your Location Here' },
    { title: 'Delivery', desc: 'Your Delivery Here' },
    { title: 'Condition', desc: 'Your Condition Here' },
]

const ProductPage = ({ params }) => {
    const router = useRouter();
    const [Heart, setHeart] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [photo, setPhoto] = useState('/Resources/profile-pic.jpg');
    const [edit, setEdit] = useState(false);
    const [item, setItem] = useState(null);
    const itemID = use(params).id;
    const t = useTranslations('Item');
    const [error, setError] = useState(null); // State to track errors
    const [userEmail, setUserEmail] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [user_id, setUserId] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                console.log("item id: " + itemID);
                const response = await fetch(`http://localhost:8080/api/listing/${itemID}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }

                const data = await response.json();
                setItem(data);
            } catch (error) {
                //console.error("Error fetching item:", error);
                setError(error.message); // Set error state
            }
        };

        fetchItem();
    }, [itemID]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const info = await getInfo();
                if (info) {
                    setUserId(info.id);
                    setUserEmail(info.email);
                }
            } catch (error) {
                setError(error.message);
            }
        }
        fetchUser();
    }, [itemID]);

    const HandleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/listing/delete/${itemID}`);
            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }
            router.push('/home');
        } catch (error) {
            setError(error);
        }
    }

    if (error) {
        return <ErrorPage statusCode={500} message={error} />; // Render error page on error
    }

    if (!item) return <Loading>Loading...</Loading>;

    const {
        title,
        price,
        description,
        category,
        sub_category,
        condition,
        delivery,
        location,
        username,
        phone_number,
        email,
        photos = [],
        customDetails = {}
    } = item;

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    }

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    }

    const handleButtonClick = async () => {
        try {
            const info = await getInfo();
            const current_user_id = info.id;
            const item_user_id = item.user_id;

            console.log("#current_user_id", current_user_id);
            console.log("#item_user_id", item_user_id);

            const response = await fetch('http://localhost:8080/chat/find-or-create-room', {
                method: 'POST',  // Corrected: use 'POST' as a string, not an array
                headers: {
                    'Content-Type': 'application/json', // Inform server that you are sending JSON data
                },
                body: JSON.stringify({
                    userId1: current_user_id,
                    userId2: item_user_id,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create or find room');
            }

            const data = await response.json();
            console.log("+_+");
            console.log(data);



            // Assuming you want to navigate after the data is returned
            router.push(`/chats/${data.room.room_id}`); // You can use the room_id from the response data
            // router.push(`/chats/2`); // You can use the room_id from the response data
        } catch (error) {
            console.error('Error:', error);
        }
    }



    const HandleFavouriteClick = async () => {

        // change the item favourite status in the database
        if (user_id) { // Reactively use the state value
            try {
                const response = await fetch('http://localhost:8080/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user_id, listingId: itemID }),
                });

                if (!response.ok) {
                    throw new Error('Failed to toggle favorite');
                }

                const result = await response.json();
                console.log(result.message);
                setHeart((prevHeart) => !prevHeart); // Toggle the UI state
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
        else {
            //redirect to login page
        }
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-4 justify-items-center p-8 gap-4 bg-gray-100">
            <div className="col-span-3 row-span-2 flex flex-col md:flex-row w-full bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                {/* Product Image */}
                <div className="w-full relative flex-col items-center self-center">
                    <div className="w-full sm:h-80 flex justify-center">
                        <img src={photos[currentIndex]} alt="Product" className="w-fit rounded-lg" />
                    </div>
                    <div className="hidden lg:flex justify-center mt-4 w-full">
                        {photos.map((image, index) => (
                            <div key={index} className="w-16 h-16 cursor-pointer m-2 border-2 rounded-lg hover:border-blue-500" onClick={() => setCurrentIndex(index)}>
                                <img src={image} className="w-full h-full object-cover rounded-md" />
                            </div>
                        ))}
                    </div>
                    {/* Left Arrow */}
                    <button onClick={prevImage} className="lg:hidden absolute top-1/2 -left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                        <FaArrowLeft />
                    </button>

                    {/* Right Arrow */}
                    <button onClick={nextImage} className="lg:hidden absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row w-full bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                {/* Product Details */}
                <div className="w-full flex flex-col">
                    <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
                    <p className="tetx-xl lg:text-2xl font-semibold mt-4">{price} JD</p>
                    {/* Buttons */}
                    <div className="flex mt-6 justify-between h-full items-end">
                        {email !== userEmail && <button onClick={handleButtonClick} className={`h-12 w-16 lg:w-24 flex flex-row items-center justify-center gap-2 bg-gray-800 text-white shadow-md text-lg rounded-md hover:bg-gray-700`}>
                            <FaComment />
                            <span className="hidden lg:block text-lg font-bold">{t('chat')}</span>
                        </button>}
                        {email !== userEmail && <button onClick={HandleFavouriteClick} className={`h-12 w-12 flex flex-row items-center justify-center bg-white text-red-500 hover:bg-gray-100 rounded-full shadow-md`}>
                            {Heart ? <FaHeart size={24} color={'crimson'} /> : <FaRegHeart size={26} />}
                        </button>}
                        {/* Edit button for seller (change hidden to flex to show) */}
                        {email == userEmail && <Link href={{ pathname: '/edit_listing', query: { id: itemID } }} className={`h-10 w-10 flex items-center justify-center gap-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700`}>
                            <FaPen />
                        </Link>}
                        {email == userEmail && <button onClick={togglePopup} className={`h-10 w-10 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-700`}>
                            <FaTrashCan />
                        </button>}
                    </div>
                </div>
            </div>
            {/* Seller Info */}
            <div className="flex items-center w-full bg-white p-8 rounded-lg gap-x-6">
                <img
                    src={photo}
                    alt="Profile"
                    className="lg:w-24 lg:h-24 w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div className='flex flex-col'>
                    <h1 className="font-bold text-md">{username}</h1>
                    {phone_number != null && <h2 className='text-md'>{phone_number}</h2>}
                </div>
            </div>
            {/* Additional Details */}
            <div className="col-span-2 h-fit flex flex-col w-full bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                <h1 className="font-bold text-xl mb-4">{t('details')}</h1>
                <ul className="grid md:grid-cols-2 gap-y-2 list-disc list-inside">
                    <li><strong>Location:</strong> {location}</li>
                    <li><strong>Delivery:</strong> {delivery ? "Yes" : "No"}</li>
                    <li><strong>Condition:</strong> {condition}</li>
                    {Object.entries(customDetails).map(([key, value], index) => (
                        <li key={index}><strong>{key}:</strong> {value}</li>
                    ))}
                </ul>
            </div>
            {/* Description */}
            <div className="col-span-2 h-fit flex flex-col w-full bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                {/* Title */}
                <h1 className="font-bold text-xl mb-4">{t('desc')}</h1>
                {/* Text content */}
                <p>
                    {description}
                </p>
            </div>
            {/* Popup for Delete item */}
            {isOpen && (
                <Popup title={t('delete')} togglePopup={togglePopup}>
                    <div className="flex space-x-4 mt-4 w-full justify-between">
                        <button
                            onClick={HandleDelete}
                            className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:bg-red-600"
                        >
                            {t('yes')}
                        </button>
                        <button
                            onClick={togglePopup}
                            className="bg-gray-300 text-black px-4 py-2 w-1/3 rounded hover:bg-gray-400"
                        >
                            {t('no')}
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default ProductPage;
