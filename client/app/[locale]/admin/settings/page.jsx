import AdminLayout from '../AdminLayout';

export default function Settings() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form>
                    <div className="mb-6">
                        <label htmlFor="siteName" className="block text-gray-700">Site Name</label>
                        <input
                            type="text"
                            id="siteName"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                            defaultValue="My Website"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="adminEmail" className="block text-gray-700">Admin Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                            defaultValue="admin@example.com"
                        />
                    </div>

                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Settings
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
