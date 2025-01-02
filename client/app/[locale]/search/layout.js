import React from "react";
import NavBar from "../home/NavBar";
import Footer from "../footer";

export default function CatLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    );
}