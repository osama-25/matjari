"use client";
import { MenuItem } from "./AdminComponent";
import { useRouter } from 'next/navigation';
import { adminLogout } from '@/lib';

export default function AdminLayout({ children }) {
    const router = useRouter();

    const handleLogout = async () => {
        await adminLogout();
        localStorage.removeItem('adminToken');
        router.push('/login-admin');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold">Admin Panel</h2>
                    </div>
                    <nav>
                        <ul>
                            {/* <MenuItem
                                text="Dashboard"
                                href="/admin/dashboard"
                            />

                            <MenuItem
                                text="Settings"
                                href="/admin/settings"
                            /> */}
                            <MenuItem
                                text="Users"
                                href="/admin/users"
                            />

                            <MenuItem
                                text="Reports"
                                href="/admin/reports"
                            />
                        </ul>
                    </nav>
                </div>
                <div className="p-6">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
