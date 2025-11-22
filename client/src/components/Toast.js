// client/src/components/Toast.js
import React from 'react';

const colorMap = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
  info: 'bg-blue-600'
};

const Toast = ({ title, description, status, onClose }) => {
  const bgColor = colorMap[status] || 'bg-gray-600';

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${bgColor} text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm">{description}</p>
        </div>
        <button className="ml-4 text-white opacity-70 hover:opacity-100" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;