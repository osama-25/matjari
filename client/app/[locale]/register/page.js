"use client";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ToastMessage from '../toast';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaEyeSlash } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import Loading from '../global_components/loading';

function RegisterPage() {
    const t = useTranslations('Register');
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const router = useRouter();
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('Nothing');
    const [showToast, setShowToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const mailpattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}/i;
        const passpattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/gm;
        if (!mailpattern.test(info.email)) {
            event.preventDefault();
            event.stopPropagation();
            setMessage("email not entered correctly!");
            setShowToast(true);
            return;
        }
        else if (!passpattern.test(info.password) || (info.password != info.confirmPassword)) {
            event.preventDefault();
            event.stopPropagation();
            setMessage("password not entered correctly!");
            setShowToast(true);
            return;
        }
        else if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.reportValidity();
            setMessage("Incorrect input!");
            setShowToast(true);
            return;
        }
        HandleRegisterPage();
    };
    async function HandleRegisterPage() {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ info })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
                localStorage.setItem("token", data.token);
                login(data.token);
                router.push('/home'); // Redirect to home if registration is successful
                setValidated(true);
                setIsAuthenticated(true);
                setMessage(data.message);
            } else {
                setMessage(data.message);
                setShowToast(true);
            }
        } catch (err) {
            setMessage("Error occurred, try again");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

    if (loading) return <Loading />;

    if (isAuthenticated) return null;

    return (
        <div className="flex min-h-screen max-w-screen md:bg-gray-100">
            <div className="flex flex-col md:flex-row w-full">
                {/* Left Image Section */}
                <div className="hidden md:block w-1/2 bg-white">
                    <div className="flex h-full">
                        <img className="object-cover w-full h-full" src="/Resources/register-photo.png" alt="Login Illustration" />
                    </div>
                </div>

                {/* Right Content Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 bg-white">
                    {/* Logo */}
                    <img className="h-20" src="/Resources/logo.jpg" alt="Logo" />

                    {/* Toast Message */}
                    <ToastMessage text={message} show={showToast} onClose={() => setShowToast(false)} />

                    {/* Form */}
                    <form
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        className="flex flex-col p-4 w-full max-w-xl"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <div className='flex flex-col sm:flex-row sm:gap-x-2'>
                            {/* First Name */}
                            <div className="mb-4 sm:w-1/2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                    {t('firstname')}
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="firstName"
                                    type="text"
                                    placeholder={t('firstnameph')}
                                    value={info.firstName}
                                    onChange={(event) => setInfo({ ...info, firstName: event.target.value })}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-4 sm:w-1/2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                    {t('lastname')}
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="lastName"
                                    type="text"
                                    placeholder={t('lastnameph')}
                                    value={info.lastName}
                                    onChange={(event) => setInfo({ ...info, lastName: event.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:gap-x-2'>
                            {/* Username */}
                            <div className="mb-4 sm:w-1/2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                                    {t('user')}
                                </label>
                                <div className="flex flex-row items-center border-2 rounded-md focus-within:border-gray-400">
                                    <span className={`bg-gray-200 ${locale === 'ar' ? 'rounded-r' : 'rounded-l'} px-3 py-2`}>@</span>
                                    <input
                                        className={`shadow-inner ${locale === 'en' ? 'rounded-r-lg' : 'rounded-l-lg'} w-full py-2 px-3 text-gray-700 focus:outline-none`}
                                        id="userName"
                                        type="text"
                                        placeholder={t('userph')}
                                        value={info.userName}
                                        onChange={(event) => setInfo({ ...info, userName: event.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4 sm:w-1/2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    {t('email')}
                                </label>
                                <input
                                    className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="email"
                                    type="email"
                                    placeholder={t('emailph')}
                                    value={info.email}
                                    onChange={(event) => setInfo({ ...info, email: event.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                {t('pass')}
                            </label>
                            <div className='relative flex'>
                                <input
                                    className="shadow-inner border-2 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('passph')}
                                    value={info.password}
                                    onChange={(event) => setInfo({ ...info, password: event.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className={`text-gray-600 absolute ${locale == 'ar' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2`}
                                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                                >
                                    {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                                </button>
                            </div>
                            {/* Password Rules */}
                            <div className="text-gray-500 text-xs mt-2">
                                <ul className="list-disc list-inside">
                                    <li>{t('rule1')}</li> {/* e.g., Minimum 8 characters */}
                                    <li>{t('rule2')}</li> {/* e.g., At least one uppercase letter */}
                                    <li>{t('rule3')}</li> {/* e.g., At least one number */}
                                </ul>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                {t('confirmpass')}
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('confirmpassph')}
                                value={info.confirmPassword}
                                onChange={(event) => setInfo({ ...info, confirmPassword: event.target.value })}
                                required
                            />
                        </div>

                        {/* Agree to terms */}
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" required />
                                <span className="mx-2">{t('agree')}</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            type="submit"
                        >
                            {t('create')}
                        </button>
                    </form>

                    {/* Login Button */}
                    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="py-2">
                        <p className="inline">{t('oldacc')} </p>
                        <Link
                            href="/login"
                            className="inline text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            {t('login')}
                        </Link>
                    </div>

                    {/* Google Login Button */}
                    <button
                        className="w-full md:w-2/3 flex items-center justify-center gap-x-2 border-2 border-black hover:bg-gray-100 font-semibold py-2 px-4 rounded-full shadow-md"
                        onClick={handleGoogleLogin}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-3 0 262 262" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                        <span>{t('google')}</span>
                    </button>
                </div>

                {/* Locale Change Button */}
                <p
                    onClick={HandleLocaleChange}
                    className="absolute right-4 top-4 sm:right-8 sm:bottom-8 p-4 text-lg cursor-pointer"
                >
                    {locale === 'ar' ? 'EN' : 'عربي'}
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
