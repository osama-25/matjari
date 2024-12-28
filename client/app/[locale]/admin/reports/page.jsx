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

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/update-report-status/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const updatedReport = await response.json();
            setReports((prevReports) =>
                prevReports.map((report) =>
                    report.id === reportId ? { ...report, status: updatedReport.report.status } : report
                )
            );
        } catch (error) {
            console.error('Failed to update report status:', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-700';
            case 'In Progress':
                return 'bg-blue-200 text-blue-700';
            case 'Resolved':
                return 'bg-green-200 text-green-700';
            default:
                return '';
        }
    };

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
                                    <select
                                        value={report.status}
                                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                        className={`py-1 px-3 rounded-full text-sm ${getStatusClass(report.status)}`}
                                    >
                                        <option value="Pending" className="bg-yellow-200 text-yellow-700">Pending</option>
                                        <option value="In Progress" className="bg-blue-200 text-blue-700">In Progress</option>
                                        <option value="Resolved" className="bg-green-200 text-green-700">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
