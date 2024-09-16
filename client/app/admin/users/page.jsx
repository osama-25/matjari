import AdminLayout from '../AdminLayout';

export default function Users() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8">Users</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-center">Role</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">John Doe</td>
                            <td className="py-3 px-6 text-left">john@example.com</td>
                            <td className="py-3 px-6 text-center">Admin</td>
                            <td className="py-3 px-6 text-center">
                                <button className="text-blue-500 hover:text-blue-700">Edit</button>
                                <button className="text-red-500 hover:text-red-700 ml-4">Delete</button>
                            </td>
                        </tr>
                        {/* More rows can go here */}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
