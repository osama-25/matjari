export default function AdminLayout({ children }) {

    const MenuItem = ({ text, ref }) => {
        return (
            <li>
                <a
                    href="/admin/dashboard"
                    className="block p-4 text-gray-200 hover:bg-gray-700"
                >
                    Dashboard
                </a>
            </li>
        )
    }
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-gray-100">
                <div className="p-6">
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a
                                href="/admin/dashboard"
                                className="block p-4 text-gray-200 hover:bg-gray-700"
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href="/admin/users"
                                className="block p-4 text-gray-200 hover:bg-gray-700"
                            >
                                Users
                            </a>
                        </li>
                        <li>
                            <a
                                href="/admin/settings"
                                className="block p-4 text-gray-200 hover:bg-gray-700"
                            >
                                Settings
                            </a>
                        </li>
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
