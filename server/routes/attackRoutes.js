// server/routes/attackRoutes.js
const express = require('express');
const router = express.Router();
const defenseMiddleware = require('../middleware/defenseMiddleware'); // Our defense engine
const AttackLog = require('../models/AttackLog'); // To update logs for ransomware sim

// Apply the defense middleware to ALL routes defined in this router.
// This means every request to these endpoints will first pass through our defense engine.
router.use(defenseMiddleware);

// --- SQL Injection Simulation Endpoint ---
router.post('/sql-injection', (req, res) => {
    // If the defense middleware detected and blocked it, this code won't be reached
    // due to the `return res.status(403)` in the middleware.

    // If it reached here, it means:
    // 1. It was a safe request.
    // 2. The defense middleware *failed* to detect an attack (a bypass!).
    // 3. (Less likely for SQLi) The middleware detected but allowed it to proceed for some reason.

    const { username, password } = req.body;
    const logInfo = req.cyberGuard; // Information from defense middleware

    let message = "Login Attempt Processed.";
    let compromised = false;

    // --- SIMULATED VULNERABILITY LOGIC (if not blocked by middleware) ---
    // This is simplified. In a real vulnerable app, the 'username' and 'password'
    // would be directly inserted into a SQL query string.
    // Here, we just simulate the outcome.
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

    // Check if middleware flagged an attack that wasn't blocked
    if (logInfo && logInfo.isAttack && logInfo.action === 'Allowed') {
         message = `Attack detected but allowed (for demonstration): ${logInfo.attackType}. ${message}`;
         compromised = true; // For simulation, assume it "compromised" if not blocked
    }


    res.status(200).json({
        message,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
        suggestedMitigation: logInfo ? logInfo.suggestedMitigation : '',
        compromised: compromised // Indicates if the "vulnerable" endpoint logic was "exploited"
    });
});

// --- XSS Simulation Endpoint ---
router.post('/xss', (req, res) => {
    const { comment } = req.body;
    const logInfo = req.cyberGuard;

    let message = `Your comment received: ${comment}`;
    let compromised = false;

    // If middleware detected XSS but allowed it (e.g., for a learning demo)
    if (logInfo && logInfo.isAttack && logInfo.action === 'Allowed') {
        message = `Attack detected but allowed (for demonstration): ${logInfo.attackType}. Your comment (potentially malicious) received: ${comment}`;
        compromised = true; // Assume XSS would "compromise" if reflected
    }

    // The rawComment is sent so the frontend can display it unsanitized to demonstrate XSS
    res.status(200).json({
        message,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
        suggestedMitigation: logInfo ? logInfo.suggestedMitigation : '',
        compromised: compromised,
        rawComment: comment // Frontend can render this to show XSS effect
    });
});

// --- Ransomware Simulation Endpoint ---
// This endpoint triggers the ransomware "effect" if not blocked
router.post('/ransomware-trigger', async (req, res) => {
    const logInfo = req.cyberGuard;
    let message = "";
    let compromised = false;

    if (logInfo && logInfo.isAttack && logInfo.attackType === 'Ransomware Simulation') {
        // This is the scenario where the defense middleware detected it,
        // but we allowed it to proceed to SHOW the effect.
        message = "Simulated Ransomware Attack Triggered! Your 'files' are now encrypted. Pay 1 BTC to recover.";
        compromised = true;

        // Optionally, we can update the log entry here to confirm the "compromise" action
        if (logInfo.logId) {
            await AttackLog.findByIdAndUpdate(logInfo.logId, { action: 'Simulated Encrypt', responseMessage: message });
        }

        // We can also re-emit the trafficUpdate with the final action if needed
        io.emit('trafficUpdate', {
            _id: logInfo.logId,
            id: uuidv4(),
            timestamp: new Date(), // Use current time for re-emit
            ip: req.ip || req.connection.remoteAddress,
            status: 'attack',
            attackType: 'Ransomware Simulation',
            payloadSnippet: JSON.stringify(req.body).substring(0, 150),
            action: 'Simulated Encrypt',
            severity: 'Critical'
        });

    } else if (logInfo && !logInfo.isAttack) {
        // This should ideally not happen if the middleware is working
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
        compromised: compromised // Indicates if the "vulnerable" endpoint logic was "exploited"
    });
});


// --- Generic Safe Request Endpoint (for testing normal traffic) ---
router.post('/safe-request', (req, res) => {
    const logInfo = req.cyberGuard;
    res.status(200).json({
        message: "This was a safe request and processed successfully.",
        echo: req.body,
        detectedByMiddleware: logInfo ? logInfo.isAttack : false,
        attackType: logInfo ? logInfo.attackType : 'Normal Request',
        severity: logInfo ? logInfo.severity : 'Low',
    });
});

module.exports = router;