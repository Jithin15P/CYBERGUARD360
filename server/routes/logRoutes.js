// server/routes/logRoutes.js
const express = require('express');
const router = express.Router();
const AttackLog = require('../models/AttackLog');

// GET /api/logs
// Fetches all logs, with optional filtering, pagination, and sorting.
router.get('/', async (req, res) => {
    try {
        const {
            limit = 20, // Default limit per page
            skip = 0,   // Default skip for pagination
            startDate,
            endDate,
            attackType,
            detected,
            severity,
            search // General search term for payload or IP
        } = req.query;

        const query = {}; // Build our MongoDB query object

        // Date range filtering
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Filter by attack type
        if (attackType && attackType !== 'All') { // 'All' can be a frontend option
            query.attackType = attackType;
        }

        // Filter by detection status
        if (detected !== undefined) {
            query.detected = detected === 'true'; // Convert string 'true'/'false' to boolean
        }

        // Filter by severity
        if (severity && severity !== 'All') {
            query.severity = severity;
        }

        // General search across payload or IP
        if (search) {
            query.$or = [
                { payload: { $regex: search, $options: 'i' } }, // Case-insensitive search in payload
                { ipAddress: { $regex: search, $options: 'i' } } // Case-insensitive search in IP
            ];
        }

        // Fetch logs with filters, pagination, and sort by newest first
        const logs = await AttackLog.find(query)
                                .sort({ timestamp: -1 }) // Sort by newest first
                                .skip(parseInt(skip))
                                .limit(parseInt(limit));

        // Get total count for pagination metadata
        const total = await AttackLog.countDocuments(query);

        res.json({
            logs,
            total,
            page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
            pages: Math.ceil(total / parseInt(limit))
        });

    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs.', error: error.message });
    }
});

// GET /api/logs/:id
// Fetches a single log entry by its ID (for detailed view/replay)
router.get('/:id', async (req, res) => {
    try {
        const log = await AttackLog.findById(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log entry not found.' });
        }
        res.json(log);
    } catch (error) {
        console.error(`Error fetching log with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching log entry.', error: error.message });
    }
});

module.exports = router;