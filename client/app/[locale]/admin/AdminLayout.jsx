"use client";
import { MenuItem } from "./AdminComponent";
export default function AdminLayout({ children }) {


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-gray-100">
                <div className="p-6">
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                </div>
                <nav>
                    <ul>

                        <MenuItem
                            text="Dashboard"
                            href="/admin/dashboard"
                        />

                        <MenuItem
                            text="Users"
                            href="/admin/users"
                        />

                        <MenuItem
                            text="Settings"
                            href="/admin/settings"
                        />


                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
