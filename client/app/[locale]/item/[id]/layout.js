import React from "react";
import NavBar from "../../home/NavBar";
import Footer from "../../footer";

export default function ItemLayout({ children }) {
    return (
        <div className="bg-gray-100">
            <NavBar />
            {children}
            <Footer />
        </div>
    );
}
