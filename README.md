This is a professional and detailed README, designed to attract recruiters and serve as excellent documentation for your friend and future collaborators.

 CyberGuard 360 — AI-Powered Attack Simulation & Defense Platform

A hands-on, full-stack environment for learning web security by simulating real-world attacks and observing an intelligent defense engine in real-time.

Key Features
Feature	Technology	Description
Attack Simulator	React, Axios	Frontend forms to launch simulated SQL Injection, XSS, Ransomware, and Safe Requests against the vulnerable backend.
AI Defense Engine	Node.js, Express Middleware	Rule-based engine that intercepts requests, detects malicious patterns, rates severity, logs the event, and conditionally blocks the attack.
Live Traffic Monitor	Socket.IO (Full-Duplex)	Real-time dashboard visualizing all incoming requests as a stream of RED (attacks) vs. GREEN (safe requests).
Detailed Attack Logging	MongoDB, Mongoose	Stores a complete record of every request, including payload, detection status, action taken, and suggested mitigation.
Log Analysis & Filtering	Express API, MongoDB Query	Backend endpoints with filtering and pagination capabilities (by type, severity, date) to power the historical logs table.
Modern UI	React, Tailwind CSS	Sleek, high-contrast dark-mode interface for a professional and impressive user experience.
🛠️ Tech Stack
Component	Technologies
Frontend (Client)	React.js, Tailwind CSS, Axios, Socket.IO Client, lucide-react (Icons), React Router.
Backend (Server)	Node.js, Express.js, MongoDB (Mongoose), Socket.IO.
⚙️ Installation & Setup
Prerequisites

Node.js (v18+)

npm

A running MongoDB instance (Local or MongoDB Atlas URI)

Step 1: Clone the Repository
code
Bash
download
content_copy
expand_less
git clone [YOUR_REPO_URL]
cd cyberguard360
Step 2: Backend Setup (Server)

Navigate to the server directory:

code
Bash
download
content_copy
expand_less
cd server

Install dependencies:

code
Bash
download
content_copy
expand_less
npm install

Configure Environment Variables:

Create a file named .env in the server directory.

Add your MongoDB connection string and desired port:

code
Env
download
content_copy
expand_less
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cyberguard360?retryWrites=true&w=majority

Start the Backend Server:

code
Bash
download
content_copy
expand_less
node server.js

(The terminal should show "MongoDB Connected" and "Server running on port 5000".)

Step 3: Frontend Setup (Client)

Navigate to the client directory:

code
Bash
download
content_copy
expand_less
cd ../client

Install dependencies:

code
Bash
download
content_copy
expand_less
npm install

Start the Frontend Application:

code
Bash
download
content_copy
expand_less
npm start

(The application will open in your browser at http://localhost:3000.)

🚀 Usage Guide

Once the backend (node server.js) and frontend (npm start) are running, navigate to http://localhost:3000.

1. Simulator View (/)

This is your interactive testing ground.

Launch an Attack: Select an attack type (e.g., SQL Injection), enter the malicious payload (e.g., ' OR 1=1; --), and click Launch Attack.

Observe Results: The Attack Report section will instantly display the backend's response:

Defense Engaged (RED 403): The middleware detected and blocked the attack.

Request Status (GREEN 200): The request was safe or the defense was successfully bypassed (in a non-critical simulation like Ransomware).

The XSS simulation includes a Reflected Content box to demonstrate the exploit if the attack is allowed.

2. Live Monitor View (/monitor)

This is your real-time security operations center.

Visualization: Every request launched from the Simulator (or any other client) will instantly appear in the Recent Activity stream.

Color Coding:

RED events indicate a detected attack.

GREEN events indicate a safe request.

Stats: The dashboard updates attack counts, safe counts, and the overall attack ratio instantly via Socket.IO.

3. Attack Logs View (/logs)

This is your historical analysis tool.

Filtering: Use the dropdowns (Attack Type, Severity, Detected Status) and the Search bar (for IP or Payload content) to filter past events.

Data Source: All entries are pulled from your MongoDB AttackLog collection.

Replay (Detail): Clicking on the Payload Snippet provides a tooltip with the full payload.

📂 Project Structure
Path	Purpose
cyberguard360/	Root Directory
├── client/	React Frontend Application
│ ├── src/	Main source code.
│ ├── src/components/	All reusable and page-level components (AttackSimulator.js, Toast.js, etc.).
│ ├── src/index.css	Tailwind CSS imports and global styles.
├── server/	Node.js/Express Backend
│ ├── .env	Environment Variables (Credentials, Port).
│ ├── server.js	Main entry point, Express/Socket.IO setup, DB connection.
│ ├── config/db.js	MongoDB connection logic.
│ ├── models/AttackLog.js	Mongoose schema for persistent logging.
│ ├── middleware/defenseMiddleware.js	The AI Defense Engine (Rule-based detection/blocking).
│ ├── routes/attackRoutes.js	Endpoints for attack simulations (uses defenseMiddleware).
│ └── routes/logRoutes.js	Endpoints for log retrieval and filtering.
🤝 Next Steps & Roadmap

Given more time, the following features would enhance CyberGuard 360:

Advanced Defense: Implement advanced detection logic (e.g., frequency analysis for brute-force, semantic analysis for complex XSS payloads).

User Authentication: Add basic user accounts to personalize the log view.

Replay Visualization: Implement a dedicated "Replay" screen that graphically animates the timeline of an attack from request -> detection -> action.

More Attack Types: Add modules for Buffer Overflows (simulated), Directory Traversal, and Command Injection.

Graphical Charts: Integrate a charting library to visualize attack trends (e.g., Top 5 Attacked IPs, Attack Type Distribution Pie Chart).

✍️ Contact
Name	Role	Email
[JITHIN LAKSHMAN]	Lead Developer	[https://www.linkedin.com/in/jithin-lakshman-p-a93263289/]

This project was built for educational purposes and to demonstrate full-stack development skills across MERN, WebSockets, and defensive programming concepts.
