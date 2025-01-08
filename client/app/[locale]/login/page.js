"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ToastMessage from '../toast';
import { login } from '../../../lib';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import Loading from '../global_components/loading';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';
import ResetPassword from '../reset-password/page';
import RequestReset from '../request-reset/page';

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
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirectTo') || '/home';
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [resetForm, setShowResetForm] = useState(false);

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
            setLoading(true);
            try {
                const ress = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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

                    const see = await login(data.token);
                    console.log("see: ");

                    console.log(see);

                    console.log("typeOf" + typeof (data.token));

                    console.log("res.token: " + data.token);
                    // 
                    localStorage.setItem('token', data.token);
                    setToastMessage(data.message);
                    setIsAuthenticated(true);
                    router.push(redirect);

                    // router.push('/home');
                }
                else {
                    handleShowToast(data.message);
                }
            } catch (err) {
                handleShowToast('Error occured try again');
                console.log("Error with /auth/login:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const NO_handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                credentials: 'include', // Include cookies if required
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                setToastMessage(data.message);
                setIsAuthenticated(true);
                router.push(redirect);
            } else {
                handleShowToast(data.message);
            }
        } catch (err) {
            handleShowToast('Error occurred, try again');
            console.log("Error with /auth/google:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />

    if (isAuthenticated) return null;

    return (
        <div className="flex h-screen max-w-screen">
            <div className="flex flex-col md:flex-row w-full">
                {/* Left Image Section */}
                <div className="hidden md:block w-1/2 bg-white">
                    <div className='flex h-screen'>
                        <img className="" src="/Resources/login-photo.png" alt="Login Illustration" />
                    </div>
                </div>
                {resetForm ?
                    <div className='md:w-1/2'>
                        <button
                            onClick={() => setShowResetForm(false)}
                            className="top-5 left-5 p-2 sm:p-8 text-lg cursor-pointer"
                        >
                            <FaArrowLeft size={26} />
                        </button>
                        <RequestReset />
                    </div> :
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-12 gap-y-6 bg-white">
                        <img className="h-20" src="/Resources/logo.jpg" alt="Logo" />
                        <ToastMessage text={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
                        <form className="w-full max-w-md flex flex-col gap-y-4" onSubmit={handleLoginPage}>
                            <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    {t('email')}
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="email"
                                    type="email"
                                    placeholder={t('emailph')}
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className='flex flex-col'>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    {t('pass')}
                                </label>
                                <div className='relative flex'>
                                    <input
                                        className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('passph')}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className={`text-gray-600 absolute ${locale === 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                <button
                                    className="place-self-end text-blue-500 hover:text-blue-700 font-semibold text-sm"
                                    onClick={() => setShowResetForm(true)} // Toggle to reset form
                                >
                                    {t('forgot')}
                                </button>
                            </div>
                            <button
                                className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                type="submit"
                            >
                                {t('login')}
                            </button>
                        </form>

                        {/* Register Button */}
                        <div>
                            <Link
                                href={'/register'}
                                className="text-blue-500 hover:text-blue-700 font-semibold"
                            >
                                {t('newacc')}
                            </Link>
                        </div>

                        {/* Modern Google Login Button */}
                        <button
                            className="w-full md:w-2/3 flex items-center justify-center gap-x-2 border-2 border-black hover:bg-gray-100 font-semibold py-2 px-4 rounded-full shadow-md"
                            onClick={handleGoogleLogin}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-3 0 262 262" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                            <span>{t('google')}</span>
                        </button>
                    </div>}
            </div>
            {!resetForm && <p
                onClick={HandleLocaleChange}
                className='absolute right-0 bottom-0 p-8 text-lg cursor-pointer'>
                {locale === 'ar' ? 'EN' : 'عربي'}
            </p>}
        </div>
    );
}
