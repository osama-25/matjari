import React from "react";
import NavBar from "../../home/NavBar";

export default function ItemLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}
