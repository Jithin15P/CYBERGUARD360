  
const mongoose = require('mongoose');

const attackLogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: true
    },
    attackType: {
        type: String,
        required: true,
        enum: ['Normal Request', 'SQL Injection', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Server-Side Request Forgery (SSRF)', 'Password Brute Force', 'Ransomware Simulation', 'Other']
    },
    payload: {
        type: String,
        required: true  
    },
    detected: {
        type: Boolean,
        default: false
    },
    action: {
        type: String,
        enum: ['Blocked', 'Allowed', 'Simulated Encrypt'],
        default: 'Allowed'
    },
    detectionRule: {
        type: String
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Low'
    },
    suggestedMitigation: {
        type: String
    },
    responseMessage: {
        type: String
    },
    targetUrl: {
        type: String
    },
    userAgent: {
        type: String  
    },
    usernameAttempt: {
        type: String
    }
});

module.exports = mongoose.model('AttackLog', attackLogSchema);