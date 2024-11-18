'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { FaArrowLeft, FaArrowRight, FaComment, FaHeart, FaPen, FaRegHeart } from 'react-icons/fa';
import Loading from '@/app/global_components/loading';


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
    const [sellerName, setSellerName] = useState('Seller Name');
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showMoreDesc, setShowMoreDesc] = useState(false);
    const visibledetails = showMoreDetails ? details : details.slice(0, 6);
    const [itemTitle, setItemTitle] = useState('Item Title');
    const [itemPrice, setItemPrice] = useState('$$$');
    const [sellerPhoneNumber, setSellerPhoneNumber] = useState('0789919165');
    const [edit, setEdit] = useState(true);

    //const { id } = params;

    // useEffect(() => {
    //     console.log('id: ' + id); // use the id to retrieve item info
    //     if (false) { // if the user is the item seller then show the edit button
    //         setEdit(true);
    //     }
    // })

    const [item, setItem] = useState(null);
    const itemID = use(params).id;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                console.log('item id' + itemID);
                const response = await fetch(`http://localhost:8080/api/listing/${itemID}`);

                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        fetchItem();
    }, [itemID]);

    // if (!item) return <p>Loading...</p>;
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
        photos = [], 
        customDetails = {} 
    } = item;

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    }

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    }

    const handleButtonClick = () => {
        router.push('/chats/1');
    }

    const HandleFavouriteClick = () => {
        setHeart(!Heart);
        // change the item favourite status in the database
    }

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
                        <button onClick={handleButtonClick} className="h-12 w-16 lg:w-24 flex flex-row items-center justify-center gap-2 bg-gray-800 text-white text-lg rounded-md hover:bg-gray-700">
                            <FaComment />
                            <span className="hidden lg:block text-lg font-bold">Chat</span>
                        </button>
                        <button onClick={HandleFavouriteClick} className="h-12 w-16 flex flex-row items-center justify-center bg-white text-red-500 hover:bg-gray-100 rounded-md shadow-lg">
                            {Heart ? <FaHeart size={24} color={'crimson'} /> : <FaRegHeart size={26} />}
                        </button>
                        {/* Edit button for seller (change hidden to flex to show) */}
                        <button className={`h-12 w-10 ${edit ? 'flex' : 'hidden'} items-center justify-center gap-2 bg-gray-800 text-white rounded-md hover:bg-gray-700`}>
                            <FaPen />
                        </button>
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
                    {sellerPhoneNumber != null && <h2 className='text-md'>{sellerPhoneNumber}</h2>}
                </div>
            </div>
            {/* Additional Details */}
            <div className="col-span-2 h-fit flex flex-col w-full bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                <h1 className="font-bold text-xl mb-4">Details</h1>
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
                <h1 className="font-bold text-xl mb-4">Description</h1>
                {/* Text content */}
                <p className={`transition-all duration-300 ${showMoreDesc ? '' : 'line-clamp-4'}`}>
                    {description}
                </p>

                {/* Toggle button */}
                <button
                    onClick={() => setShowMoreDesc(!showMoreDesc)}
                    className="text-blue-500 mt-2 self-end"
                >
                    {showMoreDesc ? "See Less" : "See More"}
                </button>
            </div>
        </div>
    );
};

export default ProductPage;
