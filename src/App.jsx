// import React, { useEffect, useState } from 'react';
// import SignupPage from './pages/SignupPage';
// import LoginPage from './pages/LoginPage';
// import SessionList from './components/SessionList';
// import ChatWindow from './components/ChatWindow';
// import { MessageSquare, ShoppingBag, LogOut, Archive, User } from 'lucide-react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./App.css"

// const Dashboard = () => {
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [activeSection, setActiveSection] = useState("escalated");
//   const [hasEscalatedUnread, setHasEscalatedUnread] = useState(false);
//   const [hasBulkUnread, setHasBulkUnread] = useState(false);

//   // 👤 Store agent details from localStorage
//   const [agent, setAgent] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//   const isAuthenticate = localStorage.getItem("isAuthenticate");
//   const storedAgent = localStorage.getItem("agent");

//   if (isAuthenticate && storedAgent && storedAgent !== "undefined") {
//     try {
//       setAgent(JSON.parse(storedAgent));
//     } catch (err) {
//       console.error("Failed to parse agent:", err);
//       localStorage.removeItem("agent"); // cleanup bad data
//       navigate('/');
//     }
//   } else {
//     navigate('/');
//   }
// }, [navigate]);


//   useEffect(() => {
//     let cancelled = false;

//     const fetchUnread = async () => {
//       try {
//         const [escRes, bulkRes] = await Promise.all([
//           fetch('http://ecofyndsupport.platinum-infotech.com:5000/api/chat/unread/sessions').then(r => r.json()),
//           fetch('http://ecofyndsupport.platinum-infotech.com:5000/api/chat/bulk-orders/unread').then(r => r.json())
//         ]);

//         const escTotal = Array.isArray(escRes)
//           ? escRes.reduce((sum, s) => sum + (Number(s.unread_count) || 0), 0)
//           : 0;
//         const bulkTotal = Array.isArray(bulkRes)
//           ? bulkRes.reduce((sum, s) => sum + (Number(s.unread_count) || 0), 0)
//           : 0;

//         if (!cancelled) {
//           setHasEscalatedUnread(escTotal > 0);
//           setHasBulkUnread(bulkTotal > 0);
//         }
//       } catch (err) {
//         console.error('Unread fetch failed:', err);
//       }
//     };

//     fetchUnread();
//     const id = setInterval(fetchUnread, 5000);
//     return () => {
//       cancelled = true;
//       clearInterval(id);
//     };
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* First Sidebar */}
//       <div className="w-20 bg-white border-r flex flex-col items-center py-4 space-y-6 shadow-md">
//         {/* 👤 User Profile Button */}
//         <button
//           className={`relative p-3 rounded-xl ${
//             activeSection === "profile"
//               ? "bg-blue-500 text-white"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           onClick={() => {
//             setActiveSection("profile");
//             setSelectedSession(null);
//           }}
//         >
//           <User className="h-6 w-6" />
//         </button>

//         {/* Escalated Sessions */}
//         <button
//           className={`relative p-3 rounded-xl ${
//             activeSection === "escalated"
//               ? "bg-blue-500 text-white"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           onClick={() => {
//             setActiveSection("escalated");
//             setSelectedSession(null);
//           }}
//         >
//           <MessageSquare className="h-6 w-6" />
//           {hasEscalatedUnread && (
//             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//           )}
//         </button>

//         {/* Bulk Orders */}
//         <button
//           className={`relative p-3 rounded-xl ${
//             activeSection === "bulk"
//               ? "bg-blue-500 text-white"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           onClick={() => {
//             setActiveSection("bulk");
//             setSelectedSession(null);
//           }}
//         >
//           <ShoppingBag className="h-6 w-6" />
//           {hasBulkUnread && (
//             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//           )}
//         </button>

//         <div className="flex-1" />

//         {/* Archive */}
//         <button
//           className={`relative p-3 rounded-xl ${
//             activeSection === "archive"
//               ? "bg-blue-500 text-white"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           onClick={() => {
//             setActiveSection("archive");
//             setSelectedSession(null);
//           }}
//         >
//           <Archive className="h-6 w-6" />
//         </button>

//         {/* Logout */}
//         <button
//           className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-600"
//           onClick={() => {
//             localStorage.removeItem("isAuthenticate");
//             localStorage.removeItem("agent");
//             localStorage.removeItem("token");
//             toast.success('🫡 Logout Successful !!')
//             navigate('/');
//           }}
//         >
//           <LogOut />
//         </button>
//       </div>

//       {/* Second Sidebar */}
//       <div className="w-72 bg-white border-r overflow-hidden shadow-sm ">
//         <div className="px-4 py-3 font-semibold text-gray-700 border-b">
//           {activeSection === "escalated"
//             ? "Escalated Sessions"
//             : activeSection === "bulk"
//             ? "Bulk Orders"
//             : activeSection === "archive"
//             ? "Archived Chats"
//             : "User Profile"}
//         </div>

//         {activeSection === "profile" ? (
//           <div className="p-4 text-gray-700">
//             {agent ? (
//               <>
//                 <h3 className="text-lg font-semibold mb-2">👤 {agent.name}</h3>
//                 <p>Email: {agent.email}</p>
//                 <p>Agent ID: {agent.agentId}</p>
//               </>
//             ) : (
//               <p className="text-gray-500">No agent info found</p>
//             )}
//           </div>
//         ) : (
//           <SessionList
//             type={activeSection}
//             onSelect={(sessionId) => setSelectedSession(sessionId)}
//             selectedSessionId={selectedSession}
//           />
//         )}
//       </div>

//       {/* Main Chat Window */}
//       <div className="flex-1">
//         {selectedSession ? (
//           <ChatWindow sessionId={selectedSession} />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-50">
//             <div className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl shadow-md p-10 w-[400px] text-center space-y-4">
//               <MessageSquare className="h-12 w-12 text-gray-400" />
//               <h2 className="text-xl font-semibold text-gray-700">No Chat Selected</h2>
//               <p className="text-gray-600 text-sm">
//                 Please choose a session from the left panel to view and respond to messages.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <>
//     <Routes>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/signup" element={<SignupPage />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}

//     </Routes>
//     <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       </>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SessionList from "./components/SessionList";
import ChatWindow from "./components/ChatWindow";
import {
  MessageSquare,
  ShoppingBag,
  LogOut,
  Archive,
  User,
} from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Dashboard = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeSection, setActiveSection] = useState("escalated");
  const [hasEscalatedUnread, setHasEscalatedUnread] = useState(false);
  const [hasBulkUnread, setHasBulkUnread] = useState(false);
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticate = localStorage.getItem("isAuthenticate");
    const storedAgent = localStorage.getItem("agent");

    if (isAuthenticate && storedAgent && storedAgent !== "undefined") {
      try {
        setAgent(JSON.parse(storedAgent));
      } catch (err) {
        console.error("Failed to parse agent:", err);
        localStorage.removeItem("agent");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const [escRes, bulkRes] = await Promise.all([
          fetch("http://ecofyndsupport.platinum-infotech.com:5000/api/chat/unread/sessions").then((r) =>
            r.json()
          ),
          fetch("http://ecofyndsupport.platinum-infotech.com:5000/api/chat/bulk-orders/unread").then((r) =>
            r.json()
          ),
        ]);

        const escTotal = Array.isArray(escRes)
          ? escRes.reduce((sum, s) => sum + (Number(s.unread_count) || 0), 0)
          : 0;
        const bulkTotal = Array.isArray(bulkRes)
          ? bulkRes.reduce((sum, s) => sum + (Number(s.unread_count) || 0), 0)
          : 0;

        if (!cancelled) {
          setHasEscalatedUnread(escTotal > 0);
          setHasBulkUnread(bulkTotal > 0);
        }
      } catch (err) {
        console.error("Unread fetch failed:", err);
      }
    };

    fetchUnread();
    const id = setInterval(fetchUnread, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* ---------- Desktop Sidebar (hidden on mobile) ---------- */}
        <div className="hidden md:flex w-20 bg-white border-r flex-col items-center py-4 space-y-6 shadow-md">
          {/* Profile */}
          <button
            type="button"
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl w-14 ${
              activeSection === "profile"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveSection("profile");
              setSelectedSession(null);
            }}
          >
            <User className="h-6 w-6" />
            <span className="text-[11px] leading-none">Profile</span>
          </button>

          {/* Escalated */}
          <button
            type="button"
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl w-14 ${
              activeSection === "escalated"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveSection("escalated");
              setSelectedSession(null);
            }}
          >
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              {hasEscalatedUnread && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </div>
            <span className="text-[11px] leading-none">Chats</span>
          </button>

          {/* Bulk */}
          <button
            type="button"
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl w-14 ${
              activeSection === "bulk"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveSection("bulk");
              setSelectedSession(null);
            }}
          >
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              {hasBulkUnread && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </div>
            <span className="text-[11px] leading-none">Bulk</span>
          </button>

          <div className="flex-1" />

          {/* Archive */}
          <button
            type="button"
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl w-14 ${
              activeSection === "archive"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveSection("archive");
              setSelectedSession(null);
            }}
          >
            <Archive className="h-6 w-6" />
            <span className="text-[11px] leading-none">Archive</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 p-3 rounded-xl w-14 text-white bg-red-500 hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("isAuthenticate");
              localStorage.removeItem("agent");
              localStorage.removeItem("token");
              toast.success("🫡 Logout Successful !!");
              navigate("/");
            }}
          >
            <LogOut className="h-6 w-6" />
            <span className="text-[11px] leading-none text-white/90">
              Logout
            </span>
          </button>
        </div>

        {/* ---------- Second Sidebar (Desktop List/Profile) ---------- */}
        <div className="hidden md:block w-72 bg-white border-r overflow-hidden shadow-sm ">
          <div className="px-4 py-3 font-semibold text-gray-700 border-b">
            {activeSection === "escalated"
              ? "Escalated Sessions"
              : activeSection === "bulk"
              ? "Bulk Orders"
              : activeSection === "archive"
              ? "Archived Chats"
              : "User Profile"}
          </div>

          {activeSection === "profile" ? (
            <div className="p-4 text-gray-700">
              {agent ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    👤 {agent.name}
                  </h3>
                  <p>Email: {agent.email}</p>
                  <p>Agent ID: {agent.agentId}</p>
                </>
              ) : (
                <p className="text-gray-500">No agent info found</p>
              )}
            </div>
          ) : (
            <SessionList
              type={activeSection}
              onSelect={(sessionId) => setSelectedSession(sessionId)}
              selectedSessionId={selectedSession}
            />
          )}
        </div>

        {/* ---------- Main Chat Area ---------- */}
        <div className="flex-1">
          {/* Mobile: List or Chat */}
          <div className="md:hidden">
            {!selectedSession ? (
              activeSection === "profile" ? (
                <div className="p-4 text-gray-700">
                  {agent ? (
                    <>
                      <h3 className="text-lg font-semibold mb-2">
                        👤 {agent.name}
                      </h3>
                      <p>Email: {agent.email}</p>
                      <p>Agent ID: {agent.agentId}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No agent info found</p>
                  )}
                </div>
              ) : (
                <SessionList
                  type={activeSection}
                  onSelect={(sessionId) => setSelectedSession(sessionId)}
                  selectedSessionId={selectedSession}
                />
              )
            ) : (
              <ChatWindow sessionId={selectedSession} />
            )}
          </div>

          {/* Desktop: Always Chat Window */}
          <div className="hidden md:flex flex-1 items-center justify-center h-full">
            {selectedSession ? (
              <ChatWindow sessionId={selectedSession} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 p-4">
                <div className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl shadow-md p-6 md:p-10 w-full max-w-sm text-center space-y-4">
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-700">
                    No Chat Selected
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Please choose a session from the left panel to view and
                    respond to messages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Mobile Bottom Navbar ---------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center h-16">
        {/* Profile */}
        <button
          type="button"
          className={`flex flex-col items-center ${
            activeSection === "profile" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => {
            setActiveSection("profile");
            setSelectedSession(null);
          }}
        >
          <User className="h-6 w-6" />
          <span className="text-[10px]">Profile</span>
        </button>

        {/* Escalated */}
        <button
          type="button"
          className={`flex flex-col items-center ${
            activeSection === "escalated" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => {
            setActiveSection("escalated");
            setSelectedSession(null);
          }}
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            {hasEscalatedUnread && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px]">Chats</span>
        </button>

        {/* Bulk */}
        <button
          type="button"
          className={`flex flex-col items-center ${
            activeSection === "bulk" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => {
            setActiveSection("bulk");
            setSelectedSession(null);
          }}
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            {hasBulkUnread && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px]">Bulk</span>
        </button>

        {/* Archive */}
        <button
          type="button"
          className={`flex flex-col items-center ${
            activeSection === "archive" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => {
            setActiveSection("archive");
            setSelectedSession(null);
          }}
        >
          <Archive className="h-6 w-6" />
          <span className="text-[10px]">Archive</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          className="flex flex-col items-center text-red-500"
          onClick={() => {
            localStorage.removeItem("isAuthenticate");
            localStorage.removeItem("agent");
            localStorage.removeItem("token");
            toast.success("🫡 Logout Successful !!");
            navigate("/");
          }}
        >
          <LogOut className="h-6 w-6" />
          <span className="text-[10px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
