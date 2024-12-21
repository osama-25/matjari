"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ToastMessage from '../toast';
import { login } from '../../../lib';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';




export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const t = useTranslations('Login');
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const [showPassword, setShowPassword] = useState(false);

    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

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
            <div className="flex justify-center items-center p-6 md:bg-gray-100 h-screen">
                <div className="w-96 flex flex-col justify-center items-center bg-white p-6 rounded-lg gap-y-4 md:shadow-lg">
                    <img className="h-16 md:h-20" src="/Resources/logo.jpg" alt="Logo" />
                    <ToastMessage text={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
                    <form className="container justify-center flex flex-col gap-y-2" onSubmit={handleLoginPage}>
                        <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="py-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {t('email')}
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                                id="email"
                                type="email"
                                placeholder={t('emailph')}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="py-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                {t('pass')}
                            </label>
                            <div className='relative flex'>
                                <input
                                    className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-400"
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('passph')}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <button
                                    type="button"
                                    className={`text-gray-600 absolute ${locale == 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2`}
                                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                                >
                                    {showPassword? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="self-center py-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                type="submit"
                            >
                                {t('login')}
                            </button>
                        </div>
                    </form>

                    {/* Register Button */}
                    <div className="py-2">
                        <Link
                            href={'/register'}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            {t('newacc')}
                        </Link>
                    </div>
                </div>
                <p
                    onClick={HandleLocaleChange}
                    className='absolute right-0 bottom-0 p-8 text-lg cursor-pointer'>
                    {locale == 'ar' ? 'EN' : 'عربي'}
                </p>
            </div>
        </>
    );

}
