"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/lib";
export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {

        localStorage.removeItem("token");
        await logout();
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
