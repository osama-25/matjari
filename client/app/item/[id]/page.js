'use client';
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from 'react';
import { FaArrowLeft, FaArrowRight, FaComment, FaHeart, FaPen, FaRegHeart } from 'react-icons/fa';

const images = [
    '/Resources/8.jpg',
    '/Resources/5.jpg',
    '/Resources/4.jpg',
    '/Resources/0.jpeg',
];

const ProductPage = ({ params }) => {
    const router = useRouter();
    const [Heart, setHeart] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [item, setItem] = useState(null);
    const itemID=params.id;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/listing/${itemID}`);
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };
        fetchItem();
    }, [itemID]);

    if (!item) return <p>Loading...</p>;

    const { title, price, description, photos = [] } = item;

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    }

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    }

    const handleButtonClick = () => {
        router.push('/chats/1');
    }

    return (
        <div className="flex justify-center p-8 bg-gray-100">
            <div className="flex flex-col md:flex-row max-w-6xl bg-white p-8 rounded-lg gap-y-4 gap-x-16">
                {/* Product Image */}
                <div className="w-full md:w-2/3 relative flex-col items-center self-center px-6">
                    <div className="w-full sm:h-80 flex justify-center">
                        <img src={photos[currentIndex]} alt="Product" className="w-fit rounded-lg" />
                    </div>
                    <div className="lg:flex justify-between mt-4 hidden">
                        {photos.map((image, index) => (
                            <div className="w-20 h-20 cursor-pointer" onClick={() => setCurrentIndex(index)}>
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

                {/* Product Details */}
                <div className="w-full md:w-1/3 md:ml-8 flex flex-col">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-2xl font-semibold mt-4">{price}JD</p>
                    <p className="mt-4 text-gray-600">
                        {description}
                    </p>

                    {/* Buttons */}
                    <div className="flex mt-6 justify-between h-full items-end">
                        <button onClick={handleButtonClick} className="h-16 w-28 flex flex-row items-center justify-center gap-2 bg-gray-800 text-white text-lg rounded-md hover:bg-gray-700">
                            <FaComment />
                            <span className="text-lg font-bold">Chat</span>
                        </button>
                        <button onClick={() => setHeart(!Heart)} className="h-16 w-20 flex flex-row items-center justify-center bg-white text-red-500 hover:bg-gray-100 rounded-md shadow-lg">
                            {Heart ? <FaHeart size={24} color={'crimson'} /> : <FaRegHeart size={26} />}
                        </button>
                        {/* Edit button for seller (change hidden to flex to show) */}
                        <button className='h-16 w-full hidden flex-row items-center justify-center gap-2 bg-gray-800 text-white text-lg rounded-md hover:bg-gray-700 justify-self-center'>
                            <FaPen />
                            <span className="text-xl font-bold">Edit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
