import { getAllUsers, getReports, banUserById, unbanUserById, saveReport, updateReportStatus, verifyAdminPassword } from "../models/adminModel.js";

export const fetchUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users); // Set status first, then respond with JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

export const fetchReports = async (req, res) => {
    try {
        const reports = await getReports();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Failed to fetch reports' });
    }
}

export const banUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await banUserById(userId);
        res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to ban user' });
    }
}

export const unbanUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await unbanUserById(userId);
        res.status(200).json({ message: 'User unbanned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to unban user' });
    }
};

export const submitReport = async (req, res) => {

    const { description, errorType, userId } = req.body;

    console.log("TEST: ", userId);

    try {
        await saveReport({ description, errorType, userId });
        res.status(200).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Failed to submit report' });
    }
}

export const updateReport = async (req, res) => {
    const reportId = req.params.id;
    const { status } = req.body;

    try {
        const updatedReport = await updateReportStatus(reportId, status);
        res.status(200).json({ report: updatedReport });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ message: 'Failed to update report status' });
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const isAdmin = await verifyAdminPassword(username, password);
        if (isAdmin) {
            res.status(200).json({ message: 'Login successful', success: true });
        } else {
            res.status(401).json({ message: 'Invalid credentials', success: false });
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};