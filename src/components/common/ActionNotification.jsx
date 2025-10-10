// src/components/common/ActionNotification.jsx
import React from "react";

export default function ActionNotification({ title, message, actions = [], onClose }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-80 border-l-4 border-blue-500 animate-slideIn">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-gray-700 text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
      </div>
      <div className="flex gap-2 mt-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
