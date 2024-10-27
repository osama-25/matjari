'use client';
import { FaPen } from "react-icons/fa";
import SideNav from "./SideNav";
import ProfileTopNav from "./TopNav";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import Popup from "../popup";

export default function ProfilePicture({ pic, togglePopup }){
    return (
        <button onClick={togglePopup} className="relative bg-gray-200 w-full h-32 flex items-end justify-center overflow-visible rounded-lg">
            <img
                src={pic}
                alt="Profile"
                className="absolute w-32 h-32 rounded-full border-4 border-white bottom-[-30px]"
            />
        </button>
    )
}

export default function ProfileLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState('/Resources/profile-pic.jpg');

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const changeProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Only PNG, JPEG, and JPG files are allowed');
                e.target.value = ''; // Clear the input
            }
            else {
                setPhoto(URL.createObjectURL(file));
                // save the photo in the user row in the database
            }
        }
    }

    return (
        <>
            <ProfileTopNav />
            <div className="flex">
                <div className="flex-initial w-1/5">
                    <SideNav />
                </div>
                <div className="flex-1 p-4">
                    <ProfilePicture pic={photo} togglePopup={togglePopup} />
                    {children}
                </div>
                {isOpen && (
                    <Popup title={'Change profile photo'} togglePopup={togglePopup}> 
                        <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={changeProfilePic} className="mt-4" />
                    </Popup>
                )}
            </div>
        </>
    );
}