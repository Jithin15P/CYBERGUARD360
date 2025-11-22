// server/middleware/defenseMiddleware.js
const AttackLog = require('../models/AttackLog'); // Our AttackLog model
const { io } = require('../server'); // Import the Socket.IO instance from server.js
const { v4: uuidv4 } = require('uuid'); // For unique IDs (npm install uuid)

// Remember to install uuid: npm install uuid

const defenseMiddleware = async (req, res, next) => {
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const targetUrl = req.originalUrl;
    const userAgent = req.headers['user-agent'];
    const requestBody = req.body; // Raw body for attacks like SQLi, XSS
    const requestQuery = req.query; // Raw query for GET requests

    let isAttack = false;
    let attackType = 'Normal Request';
    let detectionRule = '';
    let severity = 'Low';
    let action = 'Allowed';
    let suggestedMitigation = '';
    let responseMessage = 'Request Processed Safely.';
    let payload = JSON.stringify({ body: requestBody, query: requestQuery }); // Comprehensive payload for logging

    // --- Attack Detection Logic ---

    // 1. SQL Injection Detection
    // Look for common SQLi patterns in request body or query params
    const sqlInjectionPatterns = [
        /['"]\s*(OR|AND)\s*['"]?\s*\d=\d/i, // ' OR 1=1
        /['"]\s*(OR|AND)\s*['"]?true/i,     // ' OR true
        /UNION\s+SELECT/i,                 // UNION SELECT
        /--\s*|#\s*/,                       // Comments
        /SLEEP\(\d+\)/i,                   // Time-based
        /BENCHMARK\(/i                     // Benchmark
    ];

    for (const pattern of sqlInjectionPatterns) {
        if (pattern.test(payload)) {
            isAttack = true;
            attackType = 'SQL Injection';
            detectionRule = `SQLi Pattern: ${pattern.source}`;
            severity = 'Critical';
            action = 'Blocked';
            suggestedMitigation = 'Use parameterized queries or ORM for database interactions.';
            responseMessage = `Attack Detected: SQL Injection!`;
            break;
        }
    }

    // 2. Cross-Site Scripting (XSS) Detection
    // Look for common XSS tags/attributes in request body or query params
    const xssPatterns = [
        /<script\b[^>]*>(.*?)<\/script>/is, // <script>...</script>
        /javascript:/i,                  // javascript:alert(1)
        /onerror\s*=/i,                    // <img src=x onerror=alert(1)>
        /onload\s*=/i,                     // <body onload=alert(1)>
        /<svg\s*onload=/i,                 // <svg onload=alert(1)>
        /expression\(/i                    // CSS expression()
    ];

    if (!isAttack) { // Only check if not already identified as SQLi
        for (const pattern of xssPatterns) {
            if (pattern.test(payload)) {
                isAttack = true;
                attackType = 'Cross-Site Scripting (XSS)';
                detectionRule = `XSS Pattern: ${pattern.source}`;
                severity = 'High';
                action = 'Blocked';
                suggestedMitigation = 'Sanitize and encode all user-supplied input before rendering it.';
                responseMessage = `Attack Detected: Cross-Site Scripting!`;
                break;
            }
        }
    }

    // --- RANSOMWARE SIMULATION ---
    // This is a special case. It's not about detecting *malicious input* in the same way,
    // but rather simulating a trigger. For simplicity, let's say a specific
    // payload in *any* request to a specific endpoint (which we'll define later)
    // triggers the ransomware simulation. Here, we'll just define the detection.
    // The *action* (Simulated Encrypt) will be confirmed by the route handler.
    if (!isAttack && (req.originalUrl.includes('/ransomware-trigger') || payload.includes('ENCRYPT_FILES_NOW'))) {
        isAttack = true;
        attackType = 'Ransomware Simulation';
        detectionRule = 'Ransomware Trigger Phrase/Endpoint';
        severity = 'Critical';
        action = 'Simulated Encrypt'; // Special action
        suggestedMitigation = 'Isolate compromised systems, restore from secure backups, implement robust access controls.';
        responseMessage = `Ransomware Simulation Triggered!`;
        // Note: We might NOT block this, but let it proceed to the route handler
        // to display the "encrypted" message. So 'action' might be 'Allowed' here
        // but the route handler will confirm the 'Simulated Encrypt' action.
        // For now, let's still set action to blocked if it's detected.
        // We'll adjust the actual blocking logic below.
    }


    // --- Log the event ---
    try {
        const logEntry = await AttackLog.create({
            timestamp: new Date(),
            ipAddress,
            attackType: isAttack ? attackType : 'Normal Request',
            payload,
            detected: isAttack,
            action: isAttack && action !== 'Simulated Encrypt' ? 'Blocked' : action, // Block if attack, except for ransomware sim initially
            detectionRule,
            severity: isAttack ? severity : 'Low',
            suggestedMitigation: isAttack ? suggestedMitigation : '',
            responseMessage: isAttack ? responseMessage : 'Request Processed Safely.',
            targetUrl,
            userAgent
        });

        // --- Emit real-time update via Socket.IO ---
        io.emit('trafficUpdate', {
            _id: logEntry._id, // Send the ID for replay lookup
            id: uuidv4(), // A unique ID for frontend display
            timestamp: logEntry.timestamp,
            ip: ipAddress,
            status: isAttack ? 'attack' : 'safe', // 'attack' for red, 'safe' for green
            attackType: logEntry.attackType,
            payloadSnippet: payload.substring(0, 150), // Short snippet for live view
            action: logEntry.action,
            severity: logEntry.severity
        });

        // --- Conditional Blocking Logic ---
        // If an attack is detected AND it's not a ransomware simulation (which we want to "see happen")
        if (isAttack && action === 'Blocked') { // Explicitly blocked attacks
            return res.status(403).json({
                message: responseMessage,
                detected: true,
                attackType,
                severity,
                suggestedMitigation,
                logId: logEntry._id // Frontend can use this to fetch full log
            });
        }

        // For non-blocked requests (safe or ransomware sim allowed to proceed),
        // attach detection info to the request object for the route handler
        req.cyberGuard = {
            isAttack,
            attackType,
            detectionRule,
            severity,
            suggestedMitigation,
            responseMessage,
            logId: logEntry._id // Pass log ID for updates if needed by route
        };

        next(); // Proceed to the actual route handler
    } catch (error) {
        console.error('Defense Middleware Error:', error);
        // Log this internal error as well if possible
        res.status(500).json({ message: 'Internal Server Error in defense engine.' });
    }
};

module.exports = defenseMiddleware;