"use client";

import { useState } from 'react';
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
const ResetPassword = () => {
    const router = useRouter();

    // const { token } = router.query;
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [done, setDone] = useState(false);
    const t = useTranslations('Register');
    const pathname = usePathname();
    const locale = pathname.split('/')[1];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const passpattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/gm;
        if(!passpattern.test(newPassword) || (newPassword !== confirmPassword)){
            setMessage("password not entered correctly!");
            setDone(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/reset-password', {
                token,
                newPassword,
            });
            console.log(response.data);
            setDone(true);
            setMessage(response.data.message || 'Password successfully reset!');

            // useRouter().push('/login');
            router.push('/login');
        } catch (error) {
            setDone(false);
            setMessage(error.response?.data?.error || 'Failed to reset password. Please try again.');
        }
    };

    const HandleLocaleChange = () => {
        const currentLocale = pathname.split("/")[1]; // Get the current locale (e.g., "en" or "ar")
        const newLocale = currentLocale === "en" ? "ar" : "en"; // Toggle the locale

        // Remove the current locale from the path and prepend the new locale
        const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
        router.push(`/${newLocale}${pathWithoutLocale}`);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">{t('reset')}</h2>
                <form dir={locale == 'ar' ? 'rtl' : 'ltr'} onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder={t('passph')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder={t('confirmpassph')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Password Rules */}
                    <div className="text-gray-500 text-xs mt-2">
                        <ul className="list-disc list-inside">
                            <li>{t('rule1')}</li> {/* e.g., Minimum 8 characters */}
                            <li>{t('rule2')}</li> {/* e.g., At least one uppercase letter */}
                            <li>{t('rule3')}</li> {/* e.g., At least one number */}
                        </ul>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {t('reset')}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center text-sm ${done ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                {/* Locale Change Button */}
                <p onClick={HandleLocaleChange}
                    className="absolute right-4 top-4 sm:right-8 sm:bottom-8 p-4 text-lg cursor-pointer">
                    {locale === 'ar' ? 'EN' : 'عربي'}
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
