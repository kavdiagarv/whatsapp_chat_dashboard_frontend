// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import moment from "moment";
// import { LockClosedIcon } from "@heroicons/react/24/solid"; 
// import api from "../hooks/useApi";

// const socket = io("http://ecofyndsupport.platinum-infotech.com:5000"); // Change to your WebSocket server URL

// const ChatWindow = ({ sessionId }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [archivedIds, setArchivedIds] = useState([]); // 👈 store all archived session ids
//   const chatEndRef = useRef(null);

//   // ✅ Fetch archived sessions once
//   useEffect(() => {
//     const fetchArchived = async () => {
//       try {
//         const res = await api.get("/archive"); 
//         const { bulkOrders = [], escalated = [] } = res.data;

//         const ids = [
//           ...bulkOrders.map((s) => s.session_id),
//           ...escalated.map((s) => s.session_id),
//         ];

//         setArchivedIds(ids);
//       } catch (err) {
//         console.error("Error fetching archived sessions:", err);
//       }
//     };

//     fetchArchived();
//   }, []);

//   // ✅ Check if current chat is archived
//   const isArchived = archivedIds.includes(sessionId);

//   // Scroll to latest message
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
//   }, [messages]);

//   // Fetch past messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await api.get(
//           `/${sessionId}/messages`
//         );
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };
//     fetchMessages();
//   }, [sessionId]);

//   // Listen for real-time updates
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to WebSocket");
//     });

//     socket.on("new_message", (data) => {
//       if (data.session_id === sessionId) {
//         setMessages((prev) => [...prev, data]);
//       }
//     });

//     return () => {
//       socket.off("new_message");
//     };
//   }, [sessionId]);

//   // Agent sends message
//   const sendMessage = async () => {
//     if (!input.trim() || isArchived) return; // 👈 block if archived

//     const newMessage = {
//       session_id: sessionId,
//       direction: "outbound",
//       message: input.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await api.post(`/message`, newMessage);
//       setInput("");
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   // Format timestamp
//   const formatLocalTime = (utcTime) => {
//     return moment(utcTime).format("D MMM hh:mm A");
//   };

//   return (
//     <div className="flex flex-col h-[90vh] bg-white rounded shadow p-4 border w-full max-w-2xl mx-auto mt-9">
//       <div className="text-xl font-semibold mb-2 text-center border-b pb-2">
//         Chat with <span className="text-green-600">{messages?.user_id || "User"}</span>
//       </div>

//       <div className="flex-1 overflow-y-auto space-y-3 px-2 pt-3 pb-4">
//         {messages.map((msg, i) => {
//           const isBot = msg.direction === "outgoing";
//           const isUser = msg.direction === "incoming";

//           const senderLabel = isBot
//             ? "🤖 Bot"
//             : isUser
//             ? "🙋 User"
//             : "👨‍💼 Agent";

//           return (
//             <div
//               key={i}
//               className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
//             >
//               <div
//                 className={`text-xs mb-1 ${
//                   isUser ? "text-left" : "text-right"
//                 } text-gray-500`}
//               >
//                 {senderLabel} • {formatLocalTime(msg.timestamp)}
//               </div>
//               <div
//                 className={`px-4 py-2 rounded-lg text-sm whitespace-pre-line max-w-[70%] ${
//                   isUser
//                     ? "bg-green-100 text-gray-800"
//                     : "bg-blue-100 text-gray-900"
//                 }`}
//               >
//                 {msg.message}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input with lock + tooltip */}
//       <div className="mt-4 flex items-center gap-2 border-t pt-3">
//         <div className="relative flex-1">
//           <input
//             type="text"
//             className={`w-full p-2 pr-10 border rounded-lg ${
//               isArchived
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-white"
//             }`}
//             placeholder={
//               isArchived ? "Archived chats are read-only" : "Type a message..."
//             }
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             disabled={isArchived}
//             title={isArchived ? "Archived chats are read-only" : ""}
//           />
//           {isArchived && (
//             <LockClosedIcon
//               className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
//               title="Archived chats are read-only"
//             />
//           )}
//         </div>

//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           disabled={isArchived}
//           title={isArchived ? "Archived chats are read-only" : ""}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;



import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import { LockClosedIcon } from "@heroicons/react/24/solid"; 
import { FolderPlus, File} from 'lucide-react';
import api from "../hooks/useApi";

const socket = io("http://ecofyndsupport.platinum-infotech.com:5000"); // Change to your WebSocket server URL

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [archivedIds, setArchivedIds] = useState([]); // 👈 store all archived session ids
  const chatEndRef = useRef(null);

  // ✅ Fetch archived sessions once
  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const res = await api.get("/archive"); 
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

  const userId = messages.length > 0 ? messages[0].user_id : null;
  // Fetch past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/${sessionId}/messages`
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type.startsWith("image") ? "image" : "document");
    formData.append("session_id", sessionId);
    formData.append("user_id", userId);
    formData.append("phone", userId); // if user_id is the phone, else use mapped phone

    try {
      // Send to backend (must return hosted file URL)
      const response = await fetch("http://ecofyndsupport.platinum-infotech.com:5000/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Add attachment to chat messages
      setMessages(prev => [
        ...prev,
        {
          direction: "outbound",
          media_type: data.mediaType,
          message: data.fileUrl,   // backend returns hosted URL
          file_name: data.fileName,
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      alert("Failed to upload file.");
      console.error("File upload failed:", error);
    }
  };

  // Agent sends message
  const sendMessage = async () => {
    if (!input.trim() || isArchived) return; // 👈 block if archived

    const newMessage = {
      session_id: sessionId,
      direction: "outbound",
      message: input.trim(),
      timestamp: new Date().toISOString(),
      user_id: userId
    };

    try {
      await api.post(`/message`, newMessage);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const getExt = (name) => (name?.split(".").pop() || "").toUpperCase();
  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return null;
    const units = ["B","kB","MB","GB"];
    let i = 0, n = bytes;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  };

  // icon by type
  const DocIcon = ({ ext }) => (
    <div className={`flex h-10 w-10 items-center justify-center rounded-md
      ${ext === "PDF" ? "bg-red-100 text-red-600"
        : ext === "DOC" || ext === "DOCX" ? "bg-blue-100 text-blue-600"
        : "bg-gray-100 text-gray-600"}`}>
      {/* simple folded‑corner doc icon */}
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
      </svg>
    </div>
  );

  // Format timestamp
  const formatLocalTime = (utcTime) => {
    return moment(utcTime).format("D MMM hh:mm A");
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded shadow p-4 border w-full max-w-2xl mx-auto mt-9">
      <div className="text-xl font-semibold mb-2 text-center border-b pb-2">
        Chat with <span className="text-green-600">{userId || "User"}</span>
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
              {/* ✅ Check media type */}
              {msg.media_type === "image" ? (
                // 📷 Image message
                <a href={msg.message} target="_blank" rel="noopener noreferrer">
                  <img
                    src={msg.message}
                    alt="chat-img"
                    className="rounded-lg max-w-xs cursor-pointer hover:opacity-80"
                  />
                </a>
              ) : msg.media_type === "document" ? (
                <a
                  href={msg.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full max-w-sm"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm hover:shadow-md transition">
                    <File ext={getExt(msg.file_name)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-gray-900">
                        {msg.file_name || "Document"}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {formatSize(msg.file_size) ? `${formatSize(msg.file_size)} • ${getExt(msg.file_name)}` : getExt(msg.file_name)}
                      </div>
                    </div>
                    <div className="ml-2 shrink-0 rounded-full p-2 text-gray-500 ring-1 ring-gray-200 group-hover:bg-gray-50">
                      {/* download arrow */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/>
                      </svg>
                    </div>
                  </div>
                </a>
              ) : (
                // 💬 Text message
                msg.message
              )}
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

        <div className="flex items-center gap-2">
          {/* File Upload Button (disabled if archived) */}
          <label
            className={`cursor-pointer px-3 py-2 rounded-lg 
              ${isArchived ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            title={isArchived ? "Archived chats are read-only" : "Attach a file"}
          >
            <FolderPlus />
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              disabled={isArchived}
            />
          </label>

          {/* Send Button */}
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
    </div>
  );
};

export default ChatWindow;