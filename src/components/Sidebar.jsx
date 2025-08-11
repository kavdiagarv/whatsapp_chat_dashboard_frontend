// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ chats, onSelectChat }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Escalated Chats
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
          >
            {chat.customer_name || `Chat ${chat.id}`}
          </div>
        ))}
      </div>
    </div>
  );
}