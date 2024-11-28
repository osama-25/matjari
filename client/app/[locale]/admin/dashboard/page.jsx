import AdminLayout from '../AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, Admin! Here’s an overview of your site’s performance.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <p className="mt-2 text-gray-600">Total: 150</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Sales</h2>
                    <p className="mt-2 text-gray-600">This Month: $5,200</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">New Orders</h2>
                    <p className="mt-2 text-gray-600">24 new orders</p>
                </div>
            </div>
        </AdminLayout>
    );
}
