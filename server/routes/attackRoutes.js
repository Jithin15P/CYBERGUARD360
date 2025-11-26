 
const express = require('express');
const router = express.Router();
const defenseMiddleware = require('../middleware/defenseMiddleware'); 
const AttackLog = require('../models/AttackLog'); 

// REMOVED: const { getIo } = require('../server');
const { v4: uuidv4 } = require('uuid');  

// Apply the defense middleware to ALL routes defined in this router.
router.use(defenseMiddleware);

// --- SQL Injection Simulation Endpoint ---
router.post('/sql-injection', (req, res) => {
    const { username, password } = req.body;
    const logInfo = req.cyberGuard; 

    let message = "Login Attempt Processed.";
    let compromised = false;

    // SIMULATED VULNERABILITY LOGIC
    if (username === "admin" && password === "password123") {
        message = "Login Successful (Simulated Admin access).";
        compromised = true;
    } else if (username === "user" && password === "pass") {
        message = "Login Successful (Simulated User access).";
        compromised = true;
    } else {
        message = "Invalid Credentials (Simulated).";
        compromised = false;
    }

    if (logInfo && logInfo.isAttack && logInfo.action === 'Allowed') {
         message = `Attack detected but allowed (for demonstration): ${logInfo.attackType}. ${message}`;
         compromised = true; 
    }

    res.status(200).json({
        message,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
        suggestedMitigation: logInfo ? logInfo.suggestedMitigation : '',
        compromised: compromised 
    });
});

// --- XSS Simulation Endpoint ---
router.post('/xss', (req, res) => {
    const { comment } = req.body;
    const logInfo = req.cyberGuard;

    let message = `Your comment received: ${comment}`;
    let compromised = false;

    if (logInfo && logInfo.isAttack && logInfo.action === 'Allowed') {
        message = `Attack detected but allowed (for demonstration): ${logInfo.attackType}. Your comment (potentially malicious) received: ${comment}`;
        compromised = true; 
    }

    res.status(200).json({
        message,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
        suggestedMitigation: logInfo ? logInfo.suggestedMitigation : '',
        compromised: compromised,
        rawComment: comment 
    });
});

// --- Ransomware Simulation Endpoint ---
router.post('/ransomware-trigger', async (req, res) => {
    const logInfo = req.cyberGuard;
    let message = "";
    let compromised = false;

    if (logInfo && logInfo.isAttack && logInfo.attackType === 'Ransomware Simulation') {
        message = "Simulated Ransomware Attack Triggered! Your 'files' are now encrypted. Pay 1 BTC to recover.";
        compromised = true;

        if (logInfo.logId) {
            await AttackLog.findByIdAndUpdate(logInfo.logId, { action: 'Simulated Encrypt', responseMessage: message });
        }
        
        
        const { getIo } = require('../server');
        const ioInstance = getIo(); 

        ioInstance.emit('trafficUpdate', { 
            _id: logInfo.logId,
            id: uuidv4(),
            timestamp: new Date(), 
            ip: req.ip || req.connection.remoteAddress,
            status: 'attack',
            attackType: 'Ransomware Simulation',
            payloadSnippet: JSON.stringify(req.body).substring(0, 150),
            action: 'Simulated Encrypt',
            severity: 'Critical'
        });

    } else if (logInfo && !logInfo.isAttack) {
        message = "Ransomware trigger received but no attack detected by middleware.";
        compromised = false;
    } else {
        message = "Unexpected request to ransomware trigger endpoint.";
        compromised = false;
    }

    res.status(200).json({
        message,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
        suggestedMitigation: logInfo ? logInfo.suggestedMitigation : '',
        compromised: compromised 
    });
});


// --- Generic Safe Request Endpoint (for testing normal traffic) ---
router.post('/safe-request', (req, res) => {
    const logInfo = req.cyberGuard;
    res.status(200).json({
         
        message: "Success! Safe request processed.", 
        echo: req.body,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
    });
});

module.exports = router;