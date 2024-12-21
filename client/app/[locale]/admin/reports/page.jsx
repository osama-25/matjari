"use client";
import { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';

export default function Reports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/get-reports');
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            }
        };

        fetchReports();
    }, []);

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8">Reports</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Report ID</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">User ID</th>
                            <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {reports.map((report) => (
                            <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{report.id}</td>
                                <td className="py-3 px-6 text-left">{report.type}</td>
                                <td className="py-3 px-6 text-left">{report.description}</td>
                                <td className="py-3 px-6 text-left">{new Date(report.date).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-left">{report.user_id}</td>
                                <td className="py-3 px-6 text-center">
                                    <span
                                        className={`inline-block py-1 px-3 rounded-full text-sm whitespace-nowrap 
        ${report.status === 'Resolved' ? 'bg-green-200 text-green-600' :
                                                report.status === 'In Progress' ? 'bg-yellow-200 text-yellow-600' :
                                                    'bg-red-200 text-red-600'}
    `}
                                    >
                                        {report.status}
                                    </span>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
