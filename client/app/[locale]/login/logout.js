"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {

        // localStorage.removeItem("token");
        router.push('/login'); // Redirect to the login page
    };

    return (
        <button action={async () => {
            "use server";
            await logout();
            redirect("/");
        }} onClick={handleLogout}>Logout</button>
    );
}
