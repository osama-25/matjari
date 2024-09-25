import { useEffect } from 'react';
import { FaXmark } from "react-icons/fa6"

const ToastMessage = ({ show, onClose, text }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [show, onClose]);

    return (
        <>
            {show && (
                <div className="flex flex-row items-center gap-x-1 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg w-full">
                    <FaXmark />
                    {text}
                </div>
            )}
        </>
    );
};

export default ToastMessage;

