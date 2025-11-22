// server/models/AttackLog.js
const mongoose = require('mongoose');

const attackLogSchema = new mongoose.Schema({
    // Timestamp of when the event occurred
    timestamp: {
        type: Date,
        default: Date.now
    },
    // IP address of the client making the request
    ipAddress: {
        type: String,
        required: true
    },
    // General category of the attack or 'Normal Request'
    attackType: {
        type: String,
        required: true,
        enum: ['Normal Request', 'SQL Injection', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Server-Side Request Forgery (SSRF)', 'Password Brute Force', 'Ransomware Simulation', 'Other']
    },
    // The actual payload/input from the client that triggered the event
    payload: {
        type: String,
        required: true
    },
    // Boolean indicating if the defense engine detected an attack
    detected: {
        type: Boolean,
        default: false
    },
    // Action taken by the defense engine
    action: {
        type: String,
        enum: ['Blocked', 'Allowed', 'Simulated Encrypt'], // 'Simulated Encrypt' for ransomware
        default: 'Allowed'
    },
    // The specific rule or pattern that triggered the detection (if any)
    detectionRule: {
        type: String
    },
    // Severity level of the detected attack
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low' // Default for normal requests
    },
    // Suggested mitigation steps for a real-world scenario
    suggestedMitigation: {
        type: String
    },
    // Response message sent back to the client
    responseMessage: {
        type: String
    },
    // (Optional) Target URL or endpoint that was attacked
    targetUrl: {
        type: String
    },
    // (Optional) User agent of the client
    userAgent: {
        type: String
    },
    // (Optional) If it was a login attempt, record username
    usernameAttempt: {
        type: String
    }
});

module.exports = mongoose.model('AttackLog', attackLogSchema);