 
const AttackLog = require('../models/AttackLog'); 
const { getIo } = require('../server'); 
const { v4: uuidv4 } = require('uuid'); 

const defenseMiddleware = async (req, res, next) => {
    // FIX: Import the getter function inside the handler
    const { getIo } = require('../server'); 
    const ioInstance = getIo(); // Call the getter function to get the Socket.IO instance
    
    // Safely extract request details
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'Unknown IP';
    const targetUrl = req.originalUrl;
    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    
    let isAttack = false;
    let attackType = 'Normal Request';
    let detectionRule = '';
    let severity = 'Low';
    let action = 'Allowed';
    let suggestedMitigation = '';
    let responseMessage = 'Request Processed Safely.';
    
    // Safely generate payload string
    const payload = JSON.stringify({ body: req.body || {}, query: req.query || {} });
    const payloadString = String(payload); 
    const payloadSnippet = payloadString.substring(0, 150);

   

    // 1. SQL Injection Detection (Broad and Specific)
    const specificSqlInjectionPatterns = [
        /['"]\s*(OR|AND)\s*['"]?\s*\d=\d/i,      // ' OR 1=1
        /['"]\s*\d\s*=\s*\d/i,                   // '1'='1 (The missed pattern)
        /UNION\s+SELECT/i,                       // UNION SELECT
        /--\s*|#\s*/,                            // Comments
        /SELECT\s+.*?\s+FROM/i,                  // General SELECT
    ];
    
    // Broad Fallback: If payload contains a quote AND a common SQL keyword
    const broadSqlInjectionPattern = /['"].*?(SELECT|INSERT|UPDATE|DELETE|OR|AND|EXEC|XP_)/i; 

    // Execute detection logic for specific patterns
    for (const pattern of specificSqlInjectionPatterns) {
        if (pattern.test(payloadString)) {
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
    
    // Execute detection logic for broad patterns if not already flagged
    if (!isAttack && broadSqlInjectionPattern.test(payloadString)) {
        isAttack = true;
        attackType = 'SQL Injection';
        detectionRule = `SQLi Pattern: Fallback Broad Check`;
        severity = 'Critical';
        action = 'Blocked';
        suggestedMitigation = 'Use parameterized queries or ORM for database interactions.';
        responseMessage = `Attack Detected: SQL Injection! (Broad Filter)`;
    }
    
    // 2. Cross-Site Scripting (XSS) Detection 
    if (!isAttack) { 
        const xssPatterns = [/<script\b[^>]*>(.*?)<\/script>/is, /javascript:/i, /onerror\s*=/i,];
        for (const pattern of xssPatterns) {
            if (pattern.test(payloadString)) {
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

    // 3. RANSOMWARE SIMULATION  
    if (!isAttack && (targetUrl.includes('/ransomware-trigger') || payloadString.includes('ENCRYPT_FILES_NOW'))) {
        isAttack = true;
        attackType = 'Ransomware Simulation';
        detectionRule = 'Ransomware Trigger Phrase/Endpoint';
        severity = 'Critical';
        action = 'Allowed'; 
        suggestedMitigation = 'Isolate compromised systems, restore from secure backups, implement robust access controls.';
        responseMessage = `Ransomware Simulation Triggered!`;
    }

    // --- Log the event ---
    try {
        const logEntry = await AttackLog.create({
            timestamp: new Date(),
            ipAddress,
            attackType: isAttack ? attackType : 'Normal Request',
            payload: payloadString, 
            detected: isAttack,
            action: isAttack && action === 'Blocked' ? 'Blocked' : action,
            detectionRule,
            severity: isAttack ? severity : 'Low',
            suggestedMitigation: isAttack ? suggestedMitigation : '',
            responseMessage: isAttack ? responseMessage : 'Request Processed Safely.',
            targetUrl,
            userAgent 
        });

        // --- Emit real-time update via Socket.IO ---
        ioInstance.emit('trafficUpdate', { 
            _id: logEntry._id, 
            id: uuidv4(), 
            timestamp: logEntry.timestamp,
            ip: ipAddress,
            status: isAttack ? 'attack' : 'safe', 
            attackType: logEntry.attackType,
            payloadSnippet: payloadSnippet,
            action: logEntry.action,
            severity: logEntry.severity
        });

        // --- Conditional Blocking Logic ---
        if (isAttack && action === 'Blocked') { 
            return res.status(403).json({
                message: responseMessage,
                detected: true,
                attackType,
                severity,
                suggestedMitigation,
                logId: logEntry._id 
            });
        }
 
        req.cyberGuard = {
            isAttack,
            attackType,
            detectionRule,
            severity,
            suggestedMitigation,
            responseMessage,
            logId: logEntry._id 
        };

        next();  

    } catch (error) {
        console.error('Defense Middleware Error - CRITICAL CRASH:', error.message, error.stack); 
        res.status(500).json({ message: 'Internal Server Error in defense engine. Failed to process request (check backend console for details).' });
    }
};

module.exports = defenseMiddleware;