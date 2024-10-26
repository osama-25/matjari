"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToastMessage from '../toast';
import { login } from '../../lib';




export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');



    const handleShowToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleLoginPage = async (event) => {
        event.preventDefault();
        if (email == '' || password == '') {
            handleShowToast('Incorrect input!');
        }
        else {
            try {

                // const res = await fetch("http://localhost:8080/auth/login", { 
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({
                //         email,
                //         password
                //     }),
                // });

                // if (!res.ok) {
                //     throw new Error('Failed to log in');
                // }

                // const data = await res.json();

                // const res = await axios.post("http://localhost:8080/auth/login", {
                //     email,
                //     password
                // });


                const ress = await fetch("http://localhost:8080/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });




                const data = await ress.json();




                console.log(data);

                if (data.success) {

                    login(data.user, data.token);
                    console.log("typeOf" + typeof (data.token));

                    console.log("res.token: " + data.token);
                    // 
                    localStorage.setItem('token', data.token);
                    router.push('/home');
                }
                else
                    handleShowToast('User not found');

                // if (res.data.token) {
                //     // localStorage.setItem("token", res.data.token);
                //     login(res.data.user);
                //     // console.log(res.data.user);

                //     router.push('/home');
                // } else {
                //     handleShowToast('User not found');
                // }
            } catch (err) {
                handleShowToast('Error occured try again');
                console.log("Error with /auth/login:", err);
            }
        }
    };

    return (
        <>
            <div className="flex justify-center items-center p-6 bg-gray-100 h-screen">
                <div className="w-96 flex flex-col justify-center items-center bg-white p-6 rounded-lg gap-y-4 shadow-lg">
                    <img className="h-16 md:h-20" src="/Resources/logo.jpg" alt="Logo" />
                    <ToastMessage text={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
                    <form
                        // action={
                        //     async (formData) => {
                        //         // "use server";
                        //         await login(formData);
                        //         redirect("/");
                        //     }
                        // }
                        className="container justify-center flex flex-col gap-y-2" onSubmit={handleLoginPage} >
                        <div className="py-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="py-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div className="self-center py-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
