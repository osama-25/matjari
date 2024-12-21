import React from "react";
import NavBar from "../../home/NavBar";

export default function CatLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}