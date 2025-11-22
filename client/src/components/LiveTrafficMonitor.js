 // client/src/components/LiveTrafficMonitor.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const LiveTrafficMonitor = () => {
  const [traffic, setTraffic] = useState([]);
  const [attackCount, setAttackCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);
  const socketRef = useRef(null);
  const trafficContainerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('connect', () => console.log('Connected to Socket.IO'));

    socketRef.current.on('trafficUpdate', (data) => {
      setTraffic((prev) => [data, ...prev.slice(0, 29)]);

      if (data.status === 'attack') setAttackCount((prev) => prev + 1);
      else setSafeCount((prev) => prev + 1);
    });

    socketRef.current.on('disconnect', () => console.log('Socket Disconnected'));

    return () => socketRef.current && socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (trafficContainerRef.current) {
      trafficContainerRef.current.scrollTop = 0;
    }
  }, [traffic]);

  const totalRequests = attackCount + safeCount;
  const attackPercentage = totalRequests ? (attackCount / totalRequests) * 100 : 0;
  const safePercentage = 100 - attackPercentage;

  const getSeverityTag = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white shadow-red-500/70';
      case 'High': return 'bg-orange-500 text-white shadow-orange-500/70';
      case 'Medium': return 'bg-yellow-400 text-gray-900';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="p-8 bg-gray-950 rounded-xl shadow-[0_0_40px_rgba(0,255,255,0.35)] border border-cyan-500/30">
      
      <h2 className="text-4xl font-extrabold mb-10 text-cyan-300 tracking-wide drop-shadow-[0_0_10px_cyan]">
        Live Traffic Monitor
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Total Requests */}
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-inner transition-all hover:shadow-[0_0_25px_rgba(0,255,255,0.25)]">
          <p className="text-gray-400 text-lg">Total Requests</p>
          <p className="text-5xl font-extrabold text-white mt-2">{totalRequests}</p>
        </div>

        {/* Attacks */}
        <div className="p-6 bg-red-950/40 border border-red-700 rounded-xl shadow-inner transition-all hover:shadow-[0_0_25px_rgba(255,0,0,0.35)]">
          <p className="text-red-300 text-lg">Detected Attacks</p>
          <p className="text-5xl font-extrabold text-red-400 mt-2">{attackCount}</p>
          <p className="text-sm text-red-300 mt-2">{attackPercentage.toFixed(1)}% of total</p>
        </div>

        {/* Safe Requests */}
        <div className="p-6 bg-green-950/40 border border-green-700 rounded-xl shadow-inner transition-all hover:shadow-[0_0_25px_rgba(0,255,0,0.35)]">
          <p className="text-green-300 text-lg">Safe Requests</p>
          <p className="text-5xl font-extrabold text-green-400 mt-2">{safeCount}</p>
          <p className="text-sm text-green-300 mt-2">{safePercentage.toFixed(1)}% of total</p>
        </div>
      </div>

      {/* Attack Ratio Bar */}
      <div className="mb-10">
        <p className="text-lg font-semibold mb-3 text-gray-200">Attack Ratio</p>
        <div className="h-4 bg-green-600 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-red-500 transition-all duration-700 ease-out"
            style={{ width: `${attackPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm mt-2 px-1">
          <span className="text-red-300 font-medium">Attacks: {attackCount}</span>
          <span className="text-green-300 font-medium">Safe: {safeCount}</span>
        </div>
      </div>

      {/* Recent Activity */}
      <h3 className="text-2xl font-bold mb-4 text-cyan-300 drop-shadow-[0_0_6px_cyan]">Recent Activity</h3>

      <div
        ref={trafficContainerRef}
        className="space-y-4 max-h-[500px] overflow-y-auto p-3 rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm
                   shadow-inner scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
      >
        {traffic.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No traffic yet — launch an attack or a safe request!
          </p>
        ) : (
          traffic.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl shadow-lg border-l-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.25)]
                ${event.status === 'attack'
                  ? 'bg-red-900/20 border-red-500'
                  : 'bg-green-900/20 border-green-500'
                }`}
            >
              {/* Title Row */}
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-bold text-lg tracking-wide 
                    ${event.status === 'attack' ? 'text-red-300' : 'text-green-300'}`}
                >
                  {event.status === 'attack' ? '🚨 ATTACK DETECTED' : '🛡 SAFE REQUEST'}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow ${getSeverityTag(event.severity)}`}
                >
                  {event.severity}
                </span>
              </div>

              {/* Metadata */}
              <p className="text-xs text-gray-400 mb-1">
                <span className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-md mr-2 shadow">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                IP: {event.ip}
              </p>

              {/* Attack Type */}
              <p className="text-base text-gray-200">
                Type:{' '}
                <span
                  className={`font-semibold ${
                    event.status === 'attack' ? 'text-orange-300' : 'text-cyan-300'
                  }`}
                >
                  {event.attackType}
                </span>
              </p>

              {/* Payload */}
              <p className="text-xs text-gray-400 mt-1 truncate">
                Payload: {event.payloadSnippet}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveTrafficMonitor;
