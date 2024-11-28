import { Almarai, Amiri, Cairo, Inter, Montserrat, Noto_Sans_Arabic, Readex_Pro, Rubik, Source_Serif_4, Tajawal } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { use } from "react";

const englishfont = Montserrat({ subsets: ["latin"] });
const arabicfont = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });

export const metadata = {
  title: "Matjari",
  description: "Matjari app",
};

export default async function RootLayout({ children, params }) {
  const messages = await getMessages();
  const locale = (await params).locale;
  const fontClassName = locale == "ar" ? arabicfont.className : englishfont.className;
  const title = locale == 'ar'? 'متجري' : 'Matjari';

  return (
    <html lang={locale}>
      <head>
        <title>{title}</title>
        <meta name="description" content="Matjari app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={fontClassName}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body> 
    </html>
  );
}
