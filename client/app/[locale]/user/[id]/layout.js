import React from "react";
import NavBar from "../../home/NavBar";

export default function UserLayout({ children }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}
