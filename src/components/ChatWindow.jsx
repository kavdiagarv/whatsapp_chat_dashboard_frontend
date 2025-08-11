// // src/components/ChatWindow.jsx
// import React, { useEffect, useState } from 'react';
// import { getChatMessages } from '../api/chatApi';

// const ChatWindow = ({ sessionId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchChat = async () => {
//       const data = await getChatMessages(sessionId);
//       setMessages(data);
//     };

//     fetchChat();
//   }, [sessionId]);

//   return (
//     <div className="chat-window">
//       {messages.length === 0 ? (
//         <p>No messages found.</p>
//       ) : (
//         messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`message ${msg.direction === 'incoming' ? 'incoming' : 'outgoing'}`}
//           >
//             <strong>{msg.direction === 'incoming' ? 'User' : 'Bot'}:</strong> {msg.message}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ChatWindow;


// import React, { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const SOCKET_SERVER = 'http://localhost:5000'; // Change if deployed

// const ChatWindow = ({ sessionId, user_id }) => {
//   const [messages, setMessages] = useState([]);
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom when messages update
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     // 1. Fetch initial chat logs
//     axios
//       .get(`${SOCKET_SERVER}/api/chat/${sessionId}/messages`)
//       .then((res) => {
//         setMessages(res.data);
//         scrollToBottom();
//       });

//     // 2. Connect to WebSocket
//     socketRef.current = io(SOCKET_SERVER);

//     // 3. Listen for new messages
//     socketRef.current.on('new_message', (message) => {
//       if (message.session_id === sessionId) {
//         setMessages((prev) => [...prev, message]);
//         scrollToBottom();
//       }
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [sessionId]);

//   return (
//     <div className="h-screen w-full flex flex-col bg-[#e5ddd5]">
//       <div className="bg-[#075E54] text-white px-4 py-2 text-lg font-medium shadow">
//         Chat with {user_id}
//       </div>

//       <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
//         {messages.map((msg, index) => {
//           const isInbound = msg.direction === 'inbound';
//           return (
//             <div
//               key={index}
//               className={`max-w-[75%] px-3 py-2 text-sm rounded-xl ${
//                 isInbound
//                   ? 'bg-white self-start rounded-tl-none'
//                   : 'bg-[#DCF8C6] self-end rounded-tr-none'
//               } shadow`}
//             >
//               {msg.message}
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const ChatWindow = ({ sessionId}) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch chat messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/chat/${sessionId}/messages`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };
//     fetchMessages();
//   }, [sessionId]);

//   // Handle agent send message
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessage = {
//       session_id: sessionId,
//       direction: "outbound", // or "outbound"
//       message: input.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await axios.post(`http://localhost:5000/api/chat/message`, newMessage);
//       setMessages((prev) => [...prev, newMessage]);
//       setInput("");
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[90vh] bg-white rounded shadow p-4 border w-full max-w-2xl mx-auto">
//       {/* Chat Header */}
//       <div className="text-xl font-semibold mb-2 text-center border-b pb-2">
//         Chat with <span className="text-green-600">{messages?.user_id || "User"}</span>
//       </div>
//       {/* <h2 className="chat-header">
//   Chat with {messages?.user_id || "User"} (ID: {sessionId})
// </h2> */}

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto space-y-3 px-2">
//         {messages.map((msg, i) => {
//           const isBot = msg.direction === "outgoing"; 
//           const isUser = msg.direction === "incoming"; 
//           const isAgent = msg.direction === "outbound";

//           const senderLabel = isBot
//             ? "🤖 Bot"
//             : isUser
//             ? "🙋 User"
//             : "👨‍💼 Agent";

//           return (
//             <div
//               key={i}
//               className={`flex flex-col ${
//                 isUser ? "items-start" : "items-end"
//               }`}
//             >
//               <div
//                 className={`text-xs mb-1 ${
//                   isUser ? "text-left" : "text-right"
//                 } text-gray-500`}
//               >
//                 {senderLabel}
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

//       {/* Agent Input */}
//       <div className="mt-4 flex items-center gap-2 border-t pt-3">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded-lg"
//           placeholder="Type a message....."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
import moment from 'moment';


const socket = io("http://localhost:5000"); // Change to your WebSocket server URL

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial fetch of past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${sessionId}/messages`);
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
    if (!input.trim()) return;

    const newMessage = {
      session_id: sessionId,
      direction: "outbound",
      message: input.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`http://localhost:5000/api/chat/message`, newMessage);
      // setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Format timestamp to agent's local time
  const formatLocalTime = (utcTime) => {
    // const date = new Date(utcTime);
    return moment(utcTime).format('D MMM hh:mm A'); // You can customize with locale + options
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white rounded shadow p-4 border w-full max-w-2xl mx-auto mt-9">
      <div className="text-xl font-semibold mb-2 text-center border-b pb-2">
        Chat with <span className="text-green-600">{messages?.user_id || "User"}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {messages.map((msg, i) => {
          const isBot = msg.direction === "outgoing";
          const isUser = msg.direction === "incoming";
          // const isAgent = msg.direction === "outbound";

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
                className={`text-xs mb-1 ${isUser ? "text-left" : "text-right"} text-gray-500`}
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

      <div className="mt-4 flex items-center gap-2 border-t pt-3">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};


export default ChatWindow;
