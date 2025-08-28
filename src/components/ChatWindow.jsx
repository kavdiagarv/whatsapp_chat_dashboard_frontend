import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import { LockClosedIcon } from "@heroicons/react/24/solid"; 

const socket = io("https://ecofyndsupport.platinum-infotech.com/api/chat"); // Change to your WebSocket server URL

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [archivedIds, setArchivedIds] = useState([]); // 👈 store all archived session ids
  const chatEndRef = useRef(null);

  // ✅ Fetch archived sessions once
  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const res = await axios.get("https://ecofyndsupport.platinum-infotech.com/api/chat/archive"); 
        const { bulkOrders = [], escalated = [] } = res.data;

        const ids = [
          ...bulkOrders.map((s) => s.session_id),
          ...escalated.map((s) => s.session_id),
        ];

        setArchivedIds(ids);
      } catch (err) {
        console.error("Error fetching archived sessions:", err);
      }
    };

    fetchArchived();
  }, []);

  // ✅ Check if current chat is archived
  const isArchived = archivedIds.includes(sessionId);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Fetch past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://ecofyndsupport.platinum-infotech.com/api/chat/${sessionId}/messages`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [sessionId]);

  // Listen for real-time updates
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("new_message", (data) => {
      if (data.session_id === sessionId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [sessionId]);

  // Agent sends message
  const sendMessage = async () => {
    if (!input.trim() || isArchived) return; // 👈 block if archived

    const newMessage = {
      session_id: sessionId,
      direction: "outbound",
      message: input.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`https://ecofyndsupport.platinum-infotech.com/api/chat/message`, newMessage);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Format timestamp
  const formatLocalTime = (utcTime) => {
    return moment(utcTime).format("D MMM hh:mm A");
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded shadow p-4 border w-full max-w-2xl mx-auto mt-9">
      <div className="text-xl font-semibold mb-2 text-center border-b pb-2">
        Chat with <span className="text-green-600">{messages?.user_id || "User"}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-2 pt-3 pb-4">
        {messages.map((msg, i) => {
          const isBot = msg.direction === "outgoing";
          const isUser = msg.direction === "incoming";

          const senderLabel = isBot
            ? "🤖 Bot"
            : isUser
            ? "🙋 User"
            : "👨‍💼 Agent";

          return (
            <div
              key={i}
              className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
            >
              <div
                className={`text-xs mb-1 ${
                  isUser ? "text-left" : "text-right"
                } text-gray-500`}
              >
                {senderLabel} • {formatLocalTime(msg.timestamp)}
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm whitespace-pre-line max-w-[70%] ${
                  isUser
                    ? "bg-green-100 text-gray-800"
                    : "bg-blue-100 text-gray-900"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input with lock + tooltip */}
      <div className="mt-4 flex items-center gap-2 border-t pt-3">
        <div className="relative flex-1">
          <input
            type="text"
            className={`w-full p-2 pr-10 border rounded-lg ${
              isArchived
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white"
            }`}
            placeholder={
              isArchived ? "Archived chats are read-only" : "Type a message..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isArchived}
            title={isArchived ? "Archived chats are read-only" : ""}
          />
          {isArchived && (
            <LockClosedIcon
              className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
              title="Archived chats are read-only"
            />
          )}
        </div>

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isArchived}
          title={isArchived ? "Archived chats are read-only" : ""}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;