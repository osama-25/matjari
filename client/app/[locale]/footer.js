import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    const t = useTranslations('Home');
    const pathname = usePathname();
    const locale = pathname.split("/")[1];

    return (
        <footer dir={locale == 'ar'? 'rtl':'ltr'} className="bg-gray-200 py-8 px-4 mt-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* About Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">{t('aboutus')}</h2>
                    <p className="text-sm">
                        {t('aboutusdesc')}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">{t('quicklinks')}</h2>
                    <ul className="space-y-2">
                        <li><Link href="">{t('faq')}</Link></li>
                        <li><Link href="">{t('terms&conditions')}</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">{t('contactus')}</h2>
                    <p className="text-sm">123 Ecommerce St., Jordan</p>
                    <p className="text-sm">Phone: +123 456 7890</p>
                    <p className="text-sm">Email: support@ecommerce.com</p>
                </div>
            </div>

            {/* Social Media Links */}
            <div dir="ltr" className="container mx-auto flex justify-center space-x-4 mt-8">
                <a href="#" className="text-gray-400 hover:text-gray-700"><FaFacebookF /></a>
                <a href="#" className="text-gray-400 hover:text-gray-700"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-gray-700"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-gray-700"><FaLinkedinIn /></a>
            </div>

            <div className="text-center text-sm mt-8 text-gray-500">
                &copy; {new Date().getFullYear()} {t('rights')}
            </div>
        </footer>
    );
}
