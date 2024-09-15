import React from "react";

const InputField = ({ text }) => {
    return (
        <div className="m-2">
            <label htmlFor={text} className="block text-sm font-medium leading-6 text-gray-900">{text}</label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input type="text" name={text} id={text} className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
        </div>
    );
}

const Info = () => {
    return (
        <section className="border rounded border-gray-300 mt-10 p-2">
            <h1 className="m-2 font-bold">Profile Info</h1>
            <div className="grid grid-cols-2">
                <InputField text={'Name'} />
                <InputField text={'Number'} />
                <InputField text={'Email'} />
            </div>
            <div className="flex items-end justify-center mt-4">
                <button className="text-white rounded bg-red-600 p-2 hover:bg-red-500">
                    Delete Account
                </button>
            </div>
        </section>
    );
}
export default Info