// client/src/components/AttackSimulator.js
import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";  
const API_BASE_URL = "http://localhost:5000/api/attack";

const AttackSimulator = ({ showToast }) => {
  const [attackType, setAttackType] = useState("sql-injection");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  const [ransomwareTrigger, setRansomwareTrigger] = useState("");
  const [attackResponse, setAttackResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAttack = async () => {
    setIsLoading(true);
    setAttackResponse(null);

    let payload = {};
    let endpoint = "";

    switch (attackType) {
      case "sql-injection":
        endpoint = "/sql-injection";
        payload = { username, password };
        break;
      case "xss":
        endpoint = "/xss";
        payload = { comment };
        break;
      case "ransomware-trigger":
        endpoint = "/ransomware-trigger";
        payload = { triggerPhrase: ransomwareTrigger };
        break;
      case "safe-request":
        endpoint = "/safe-request";
        payload = { message: "Hello, CyberGuard!" };
        break;
      default:
        showToast("Error", "Invalid attack type", "error");
        setIsLoading(false);
        return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      setAttackResponse(res.data);

      showToast(
        "Attack Launched!",
        res.data.message || "Request completed successfully.",
        res.data.detectedByMiddleware ? "warning" : "success"
      );
    } catch (error) {
      if (error.response) {
        setAttackResponse(error.response.data);
        showToast("Defense Triggered!", error.response.data.message, "error");
      } else {
        showToast("Network Error", "Backend not responding", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "text-red-400 bg-red-900/40 border-red-700";
      case "High":
        return "text-orange-400 bg-orange-900/40 border-orange-700";
      case "Medium":
        return "text-yellow-400 bg-yellow-900/40 border-yellow-700";
      default:
        return "text-green-400 bg-green-900/40 border-green-700";
    }
  };

  const renderForm = () => {
    switch (attackType) {
      case "sql-injection":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Try admin' OR '1'='1"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password"
                className="input-field"
              />
            </div>
          </div>
        );

      case "xss":
        return (
          <div>
            <label className="text-sm text-gray-400">Comment / Payload</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Try <script>alert('XSS')</script>"
              rows={4}
              className="input-field"
            ></textarea>
          </div>
        );

      case "ransomware-trigger":
        return (
          <div>
            <label className="text-sm text-gray-400">Trigger Phrase</label>
            <input
              value={ransomwareTrigger}
              onChange={(e) => setRansomwareTrigger(e.target.value)}
              placeholder="Try ENCRYPT_FILES_NOW"
              className="input-field"
            />
          </div>
        );

      case "safe-request":
        return (
          <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            Sends a harmless request for testing.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-950/70 backdrop-blur-2xl shadow-xl rounded-2xl border border-gray-800">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6"> Attack Simulator</h2>

      <div className="space-y-8">
        
        <div>
          <label className="text-lg font-semibold text-gray-300 mb-2 block">
            Choose Attack Type
          </label>
          <select
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
            className="input-field"
          >
            <option value="sql-injection">SQL Injection</option>
            <option value="xss">Cross-Site Scripting (XSS)</option>
            <option value="ransomware-trigger">Ransomware Trigger</option>
            <option value="safe-request">Safe Request</option>
          </select>
        </div>

       
        <div className="card-section">
          <h3 className="section-title"> Attack Payload</h3>
          {renderForm()}
        </div>

         
        <button
          onClick={handleAttack}
          disabled={isLoading}
          className={`w-full py-3 font-bold rounded-xl transition-all ${
            isLoading
              ? "bg-red-800/40 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Launching..." : "Launch Attack"}
        </button>

       
        {attackResponse && (
          <div
            className={`p-6 rounded-xl border shadow-lg mt-4 ${
              attackResponse.detectedByMiddleware ||
              attackResponse.compromised
                ? "border-red-500 bg-red-950/30"
                : "border-green-500 bg-green-950/20"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                attackResponse.detectedByMiddleware
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {attackResponse.detectedByMiddleware || attackResponse.compromised
                ? " Attack Report"
                : " Request Successful"}
            </h3>

            <div className="space-y-3">
              <div>
                <p className="label">Message:</p>
                 
                <p className="value">
                  {attackResponse.message || "No message returned by endpoint."}
                </p>
              </div>

              {attackResponse.attackType && (
                <div>
                  <p className="label">Attack Type:</p>
                  <p className="text-orange-300 font-semibold">
                    {attackResponse.attackType}
                  </p>
                </div>
              )}

              {attackResponse.severity && (
                <div>
                  <p className="label">Severity:</p>
                  <span
                    className={`px-3 py-1 rounded-full border ${getSeverityColor(
                      attackResponse.severity
                    )}`}
                  >
                    {attackResponse.severity}
                  </span>
                </div>
              )}

              {attackResponse.rawComment && (
                <div>
                  <p className="label">Reflected Content (XSS Demo):</p>
                  <div className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: attackResponse.rawComment,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      
      <style>{`
        .input-field {
          width: 100%;
          padding: 12px;
          background-color: rgba(17, 24, 39, 0.9);
          border: 1px solid #374151;
          border-radius: 10px;
          outline: none;
          color: white;
          transition: 0.2s;
        }
        .input-field:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 10px #06b6d455;
        }

        .card-section {
          background: rgba(31, 41, 55, 0.6);
          padding: 20px;
          border-radius: 14px;
          border: 1px solid #374151;
        }

        .section-title {
          color: #e5e7eb;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .label {
          font-size: 12px;
          color: #9ca3af;
        }

        .value {
          color: white;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AttackSimulator;