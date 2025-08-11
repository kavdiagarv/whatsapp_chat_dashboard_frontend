// src/components/Message.jsx
import React from "react";

export default function Message({ msg }) {
  const isAgent = msg.sender === "agent";
  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs ${
          isAgent ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}