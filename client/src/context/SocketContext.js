 
import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';
    
 
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [traffic, setTraffic] = useState([]);
  const [attackCount, setAttackCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);
  const socketRef = useRef(null);
  
 
  const didMountRef = useRef(false);

  useEffect(() => {
     
    if (socketRef.current && socketRef.current.connected) {
        console.log('Socket.IO: Already Connected. Skipping useEffect.');
        return;
    }
    
 
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('connect', () => {
      console.log('Socket.IO: PERSISTENT CONNECTION ESTABLISHED.');
    });
    
    socketRef.current.on('connect_error', (err) => {
        console.error('Socket.IO PERSISTENT CONNECTION ERROR:', err.message);
    });

     
    socketRef.current.on('trafficUpdate', (data) => {
        console.log('Socket.IO: Context Received Data');
        
         
        setTraffic((prev) => {
            
            const isDuplicate = prev.some(item => item._id === data._id);
            
            
            if (!isDuplicate) {
                 
                const newTrafficArray = [data, ...prev.slice(0, 29)]; 
                return newTrafficArray;
            }
            
             
            return prev;
        }); 
        
    
        setAttackCount((prev) => data.status === 'attack' ? prev + 1 : prev);
        setSafeCount((prev) => data.status === 'safe' ? prev + 1 : prev);
    });

    socketRef.current.on('disconnect', () => console.log('Socket.IO: Disconnected'));

    
    return () => {
         
        
    };
  }, []);  

  const value = {
    traffic,
    attackCount,
    safeCount,
    totalRequests: attackCount + safeCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

 
export const useSocketData = () => useContext(SocketContext);