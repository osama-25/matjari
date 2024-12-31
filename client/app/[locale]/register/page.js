"use client";
import axios from 'axios';
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
        if(!mailpattern.test(info.email)){
            event.preventDefault();
            event.stopPropagation();
            setMessage("email not entered correctly!");
            setShowToast(true);
            return;
        }
        else if(!passpattern.test(info.password) || (info.password != info.confirmPassword)){
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
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { info });
            const data = res.data;

            if (data.success) {
                localStorage.setItem("token", res.data.token);
                router.push('/home'); // Redirect to home if registration is successful
                setValidated(true);
                setIsAuthenticated(true);
                setMessage(data.message);
            } else {
                setValidated(false);
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Error occured try again");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }

    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

    if(loading) return <Loading />;

    if(isAuthenticated) return null;

    return (
        <div className="relative flex justify-center items-center p-6 sm:p-8 md:p-12 md:bg-gray-100">
            <div className="w-full md:max-w-xl flex flex-col justify-center items-center bg-white p-2 sm:p-6 md:p-8 rounded-lg gap-y-4 md:shadow-lg">
                {/* Logo */}
                <img className="h-12 sm:h-16 md:h-20" src="/Resources/logo.jpg" alt="Logo" />

                {/* Toast Message */}
                <ToastMessage text={message} show={showToast} onClose={() => setShowToast(false)} />

                {/* Form */}
                <form dir={locale === 'ar' ? 'rtl' : 'ltr'} className="flex flex-col p-4 sm:p-6 w-full max-w-xl" noValidate onSubmit={handleSubmit}>
                    <div className='flex flex-col sm:flex-row sm:gap-x-2'>
                        {/* First Name */}
                        <div className="mb-4 sm:w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                {t('firstname')}
                            </label>
                            <input
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
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
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
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
                                    className={`shadow-inner ${locale === 'en' ? 'rounded-r' : 'rounded-l'} w-full py-2 px-3 text-gray-700 focus:outline-none`}
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
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
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
                                className="shadow-inner border-2 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-400"
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
                    <div className="self-center py-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            type="submit"
                        >
                            {t('create')}
                        </button>
                    </div>
                </form>
                {/* Login Button */}
                <div dir={locale == 'ar' ? 'rtl' : 'ltr'} className="py-2">
                    <p className='inline'>{t('oldacc')} </p>
                    <Link
                        href={'/login'}
                        className="inline text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        {t('login')}
                    </Link>
                </div>
            </div>

            {/* Locale Change Button */}
            <p onClick={HandleLocaleChange}
                className="absolute right-4 top-4 sm:right-8 sm:bottom-8 p-4 text-lg cursor-pointer">
                {locale === 'ar' ? 'EN' : 'عربي'}
            </p>
        </div>
    );
}

export default RegisterPage;
