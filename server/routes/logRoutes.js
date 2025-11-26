 // server/routes/logRoutes.js
const express = require('express');
const router = express.Router();
const AttackLog = require('../models/AttackLog');

// GET /api/logs - Fetches all logs with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            limit = 20, 
            skip = 0,   
            startDate,
            endDate,
            attackType,
            detected,
            severity,
            search 
        } = req.query;

        const query = {}; 

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (attackType && attackType !== 'All') { 
            query.attackType = attackType;
        }

        if (detected !== undefined && detected !== 'All') {
            query.detected = detected === 'true'; 
        }

        if (severity && severity !== 'All') {
            query.severity = severity;
        }

        if (search) {
            query.$or = [
                { payload: { $regex: search, $options: 'i' } }, 
                { ipAddress: { $regex: search, $options: 'i' } } 
            ];
        }

        const logs = await AttackLog.find(query)
                                .sort({ timestamp: -1 }) 
                                .skip(parseInt(skip))
                                .limit(parseInt(limit));

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

// GET /api/logs/:id - Fetches a single log entry by its ID
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