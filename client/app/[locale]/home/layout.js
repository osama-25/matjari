import { Inter, Source_Serif_4 } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
