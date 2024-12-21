import { getAllUsers, getReports, banUserById } from "../models/adminModel.js";

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