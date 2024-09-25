"use client";
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToastMessage from '../toast';

function RegisterPage() {

    const router = useRouter();
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('Nothing');
    const [showToast, setShowToast] = useState(false);
    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setMessage("Incorrect input!");
            setShowToast(true);
            return;
        }

        HandleRegisterPage();
    };

    async function HandleRegisterPage() {
        try {
            const res = await axios.post("http://localhost:8080/auth/register", { info });
            const data = res.data;

            if (data.success) {
                localStorage.setItem("token", res.data.token);
                router.push('/home'); // Redirect to home if registration is successful
                setValidated(true);
                setMessage(data.message);
            } else {
                setValidated(false);
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Error occured try again");
            setShowToast(true);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center p-12 bg-gray-100 ">
                <div className="max-w-xl flex flex-col justify-center items-center bg-white p-6 rounded-lg gap-y-4 shadow-lg">
                    <img className="h-16 md:h-20" src="/Resources/logo.jpg" alt="Logo" />
                    <ToastMessage text={message} show={showToast} onClose={() => setShowToast(false)} />
                    <form className="flex flex-col p-8 w-full max-w-xl" noValidate onSubmit={handleSubmit}>
                        <div className='flex flex-row gap-x-2'>
                            {/* First Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    value={info.firstName}
                                    onChange={(event) => setInfo({ ...info, firstName: event.target.value })}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    value={info.lastName}
                                    onChange={(event) => setInfo({ ...info, lastName: event.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-row gap-x-2'>
                            {/* Username */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                                    Username
                                </label>
                                <div className="flex flex-row items-center border-2 rounded-md focus-within:border-gray-400">
                                    <span className="bg-gray-200 rounded-l px-3 py-2">@</span>
                                    <input
                                        className="shadow-inner rounded-r w-full py-2 px-3 text-gray-700 focus:outline-none"
                                        id="userName"
                                        type="text"
                                        placeholder="Username"
                                        value={info.userName}
                                        onChange={(event) => setInfo({ ...info, userName: event.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={info.email}
                                    onChange={(event) => setInfo({ ...info, email: event.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={info.password}
                                onChange={(event) => setInfo({ ...info, password: event.target.value })}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={info.confirmPassword}
                                onChange={(event) => setInfo({ ...info, confirmPassword: event.target.value })}
                                required
                            />
                        </div>

                        {/* Agree to terms */}
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" required />
                                <span className="ml-2">Agree to terms and conditions</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="self-center py-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
