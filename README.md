 CyberGuard 360 — AI-Powered Attack Simulation & Defense Platform
================================================================

A full-stack, interactive cybersecurity lab that simulates real-world web attacks and demonstrates how an intelligent defense engine detects, analyzes, and blocks them in real time.

----------------------------------------------------------------
KEY FEATURES
----------------------------------------------------------------

1. Attack Simulator
   - Technologies: React, Axios
   - Description: Launch simulated SQL Injection, XSS, Ransomware, and safe requests to the backend.

2. AI Defense Engine
   - Technologies: Node.js, Express Middleware
   - Description: Rule-based middleware that detects malicious patterns, assigns severity, logs the event, and blocks the attack.

3. Live Traffic Monitor
   - Technologies: Socket.IO
   - Description: Real-time visualization of every incoming request (attack or safe).

4. Detailed Attack Logging
   - Technologies: MongoDB, Mongoose
   - Description: Stores payloads, detection status, severity, timestamps, and mitigation suggestions.

5. Log Analysis & Filtering
   - Technologies: Express API, MongoDB Querying
   - Description: Filter logs by attack type, severity, date, or detection status.

6. Modern UI
   - Technologies: React + Tailwind CSS
   - Description: A clean, dark-mode, high-contrast user interface.

----------------------------------------------------------------
TECH STACK
----------------------------------------------------------------

Frontend:
- React.js
- Tailwind CSS
- Axios
- Socket.IO client
- lucide-react icons
- React Router

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO

----------------------------------------------------------------
INSTALLATION AND SETUP
----------------------------------------------------------------

Prerequisites:
- Node.js (v18+)
- npm
- MongoDB (local or Atlas)

Step 1: Clone the repository
----------------------------
git clone https://github.com/Jithin15P/CYBERGUARD360.git
cd cyberguard360

Step 2: Backend Setup
---------------------
cd server
npm install

Create a .env file inside "server" directory:

PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cyberguard360

Start the backend:
node server.js

Expected output:
"MongoDB Connected"
"Server running on port 5000"

Step 3: Frontend Setup
----------------------
cd ../client
npm install
npm start

Application runs at:
http://localhost:3000

----------------------------------------------------------------
USAGE GUIDE
----------------------------------------------------------------

1. Simulator View ("/")
   - Select an attack type (SQL Injection, XSS, Ransomware, Safe Request).
   - Enter payload and launch the attack.
   - Immediate feedback:
       - Blocked attacks return 403.
       - Safe or allowed attacks show 200.
   - XSS tests show reflected payload.

2. Live Monitor ("/monitor")
   - Real-time activity stream via Socket.IO.
   - Shows all inbound requests as "attack" or "safe".
   - Displays counts, ratios, and continuous updates.

3. Attack Logs ("/logs")
   - Complete history stored in MongoDB.
   - Filter logs by:
       - Attack type
       - Severity
       - Detection status
       - Date
   - Search by payload or IP.
   - Click on payload preview to view full data.

----------------------------------------------------------------
PROJECT STRUCTURE
----------------------------------------------------------------
cyberguard360/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # AttackSimulator, Monitor, Logs, UI components
│   │   └── index.css       # Tailwind global styles
│
├── server/                 # Node.js Backend
│   ├── server.js           # Express + Socket.IO setup
│   ├── config/db.js        # Database connection
│   ├── models/AttackLog.js # MongoDB Schema (Mongoose)
│   ├── middleware/
│   │   └── defenseMiddleware.js  # AI Defense Engine
│   ├── routes/
│   │   ├── attackRoutes.js # Attack simulation routes
│   │   └── logRoutes.js    # Logs and filtering routes
│   └── .env                # Env variables (not included in repo)


----------------------------------------------------------------
ROADMAP / FUTURE IMPROVEMENTS
----------------------------------------------------------------

- Implement advanced detection (semantic payload analysis, brute-force pattern tracking)
- Add user accounts and authentication
- Add attack replay visualization
- Add more attack modules (Directory Traversal, Command Injection, simulated Buffer Overflow)
- Integrate analytics dashboards with charts

----------------------------------------------------------------
CONTACT
----------------------------------------------------------------

Developer: Jithin Lakshman  
LinkedIn: https://www.linkedin.com/in/jithin-lakshman-p-a93263289/

Note:
This project is for educational purposes only and demonstrates modern full-stack development with real-time communication and defensive security engineering.
