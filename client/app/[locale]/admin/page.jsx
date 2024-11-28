import AdminLayout from './AdminLayout';

export default function AdminHome() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome to the Admin Panel</h1>
                <p className="mt-2 text-gray-600">Here you can manage all aspects of the application.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold">Getting Started</h2>
                <p className="mt-2 text-gray-600">
                    Use the sidebar to navigate to different sections such as Dashboard, Users, and Settings.
                    You can manage users, view analytics, and configure settings from this panel.
                </p>
            </div>
        </AdminLayout>
    );
}
