 import React, { useState, useEffect } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

const AttackLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    attackType: "All",
    detected: "All",
    severity: "All",
  });

  const [localSearch, setLocalSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch logs from backend
  const fetchLogs = async (page = 1) => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        page,
        search: localSearch || "",
        attackType: filters.attackType,
        detected: filters.detected,
        severity: filters.severity,
      });

      const res = await fetch(
        `http://localhost:5000/api/attack-logs?${queryParams.toString()}`
      );

      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchLogs(1);
  };

  const clearSearch = () => {
    setLocalSearch("");
    fetchLogs(1);
  };

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) fetchLogs(page);
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Low":
        return "text-green-300 border-green-400/40";
      case "Medium":
        return "text-yellow-300 border-yellow-400/40";
      case "High":
        return "text-orange-300 border-orange-400/40";
      case "Critical":
        return "text-red-300 border-red-400/40";
      default:
        return "text-gray-300 border-gray-600";
    }
  };

  return (
    <div className="p-8 bg-gray-950/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800">
      {/* HEADER */}
      <h2 className="text-4xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Attack Logs
      </h2>

      {/* FILTER SECTION */}
      <div className="space-y-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Attack Type */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Attack Type</label>
            <select
              name="attackType"
              value={filters.attackType}
              onChange={handleFilterChange}
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-gray-300 
                         hover:border-cyan-500 transition-all focus:ring-2 focus:ring-cyan-600"
            >
              <option value="All">All Types</option>
              <option value="Normal Request">Normal Request</option>
              <option value="SQL Injection">SQL Injection</option>
              <option value="Cross-Site Scripting (XSS)">XSS</option>
              <option value="Ransomware Simulation">Ransomware Sim.</option>
            </select>
          </div>

          {/* Detected */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Detected</label>
            <select
              name="detected"
              value={filters.detected}
              onChange={handleFilterChange}
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-gray-300 
                         hover:border-cyan-500 transition-all focus:ring-2 focus:ring-cyan-600"
            >
              <option value="All">All Statuses</option>
              <option value="true">Detected</option>
              <option value="false">Not Detected</option>
            </select>
          </div>

          {/* Severity */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Severity</label>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-gray-300 
                         hover:border-cyan-500 transition-all focus:ring-2 focus:ring-cyan-600"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm">Search (Payload/IP)</label>
            <div className="relative">
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search payload or IP..."
                className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-gray-300
                           pr-12 focus:ring-2 focus:ring-cyan-600 hover:border-cyan-500 transition-all"
              />
              {localSearch ? (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
                     rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-40"
        >
          {isLoading ? "Applying Filters..." : "Apply Filters"}
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No logs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-800">
            <table className="min-w-full">
              <thead className="bg-gray-900/80">
                <tr>
                  {[
                    "Time",
                    "IP Address",
                    "Attack Type",
                    "Detected",
                    "Action",
                    "Severity",
                    "Payload Snippet",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-gray-950/40">
                {logs.map((log, idx) => (
                  <tr
                    key={log._id}
                    className={`transition-colors hover:bg-gray-800/40 ${
                      idx % 2 === 0 ? "bg-gray-900/40" : "bg-gray-950/40"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-300">
                      {log.ipAddress}
                    </td>

                    {/* Attack Type */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-600/40 text-blue-300 text-xs font-semibold">
                        {log.attackType}
                      </span>
                    </td>

                    {/* Detected */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.detected
                            ? "bg-red-600/40 text-red-300"
                            : "bg-green-600/40 text-green-300"
                        }`}
                      >
                        {log.detected ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full border border-gray-600 text-gray-300 text-xs">
                        {log.action}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full border ${getSeverityClass(
                          log.severity
                        )} text-xs`}
                      >
                        {log.severity}
                      </span>
                    </td>

                    <td
                      className="px-6 py-4 text-gray-400 max-w-xs overflow-hidden"
                      title={log.payload}
                    >
                      {log.payload.substring(0, 60)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-400
                         hover:bg-gray-800 hover:border-cyan-500 transition disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-gray-300 font-semibold">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-400
                         hover:bg-gray-800 hover:border-cyan-500 transition disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttackLogs;
