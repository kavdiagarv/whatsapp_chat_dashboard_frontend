// import React, { useEffect, useState } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import SessionList from './components/SessionList';
// import ChatWindow from './components/ChatWindow';
// import { MessageSquare, ShoppingBag, LogOut } from 'lucide-react';

// const Dashboard = () => {
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [activeSection, setActiveSection] = useState("escalated");
//   const navigate = useNavigate();

//   useEffect(() => {
//     let isAuthenticate = localStorage.getItem("isAuthenticate");
//     if (isAuthenticate) {
//       navigate('/dashboard'); 
//     } else {
//       navigate('/');
//     }
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* First Sidebar (Navigation) */}
//       <div className="w-20 bg-white border-r flex flex-col items-center py-4 space-y-6 shadow-md">
//         <button
//           className={`p-3 rounded-xl ${
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
//         </button>

//         <button
//           className={`p-3 rounded-xl ${
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
//         </button>

//         <div className="flex-1"></div>

//         {/* Logout at bottom */}
//         <button
//           className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-600"
//           onClick={() => {
//             localStorage.removeItem("isAuthenticate");
//             navigate('/');
//           }}
//         >
//           <LogOut />
//         </button>
//       </div>

//       {/* Second Sidebar (Session List) */}
//       <div className="w-72 bg-white border-r overflow-hidden shadow-sm ">
//         <div className="px-4 py-3 font-semibold text-gray-700 border-b">
//           {activeSection === "escalated" ? "Escalated Sessions" : "Bulk Orders"}
//         </div>
//         <SessionList
//           type={activeSection}   // ✅ Pass type directly
//           onSelect={(sessionId) => setSelectedSession(sessionId)}
//           selectedSessionId={selectedSession}
//         />
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
//     <Routes>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SessionList from './components/SessionList';
import ChatWindow from './components/ChatWindow';
import { MessageSquare, ShoppingBag, LogOut, Archive } from 'lucide-react';

const Dashboard = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeSection, setActiveSection] = useState("escalated");

  // ✅ just booleans for red dot badges (no numbers)
  const [hasEscalatedUnread, setHasEscalatedUnread] = useState(false);
  const [hasBulkUnread, setHasBulkUnread] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticate = localStorage.getItem("isAuthenticate");
    if (isAuthenticate) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 🔔 poll your unread endpoints and show a dot if any unread exist
  useEffect(() => {
    let cancelled = false;

    const fetchUnread = async () => {
      try {
        const [escRes, bulkRes] = await Promise.all([
          fetch('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/unread/sessions').then(r => r.json()),
          fetch('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/bulk-orders/unread').then(r => r.json())
        ]);

        // both endpoints return arrays; each item has unread_count
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
        // network errors shouldn't crash UI
        console.error('Unread fetch failed:', err);
      }
    };

    fetchUnread();
    const id = setInterval(fetchUnread, 5000); // refresh every 5s
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* First Sidebar (Navigation) */}
      <div className="w-20 bg-white border-r flex flex-col items-center py-4 space-y-6 shadow-md">

        {/* Escalated Sessions Button */}
        <button
          className={`relative p-3 rounded-xl ${
            activeSection === "escalated"
              ? "bg-blue-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          onClick={() => {
            setActiveSection("escalated");
            setSelectedSession(null);
          }}
        >
          <MessageSquare className="h-6 w-6" />
          {hasEscalatedUnread && (
            <span
              className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              aria-label="Unread escalated"
            />
          )}
        </button>

        {/* Bulk Orders Button */}
        <button
          className={`relative p-3 rounded-xl ${
            activeSection === "bulk"
              ? "bg-blue-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          onClick={() => {
            setActiveSection("bulk");
            setSelectedSession(null);
          }}
        >
          <ShoppingBag className="h-6 w-6" />
          {hasBulkUnread && (
            <span
              className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              aria-label="Unread bulk orders"
            />
          )}
        </button>

        <div className="flex-1" />

        {/* Archive Button */}
        <button
           className={`relative p-3 rounded-xl ${
            activeSection === "archive"
              ? "bg-blue-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}  
          onClick={() => {
            setActiveSection("archive");
            setSelectedSession(null);
          }}
        >
          <Archive className='h-6 w-6' />
        </button>

        {/* Logout at bottom */}
        <button
          className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("isAuthenticate");
            navigate('/');
          }}
        >
          <LogOut />
        </button>
      </div>

      {/* Second Sidebar (Session List) */}
      <div className="w-72 bg-white border-r overflow-hidden shadow-sm ">
        <div className="px-4 py-3 font-semibold text-gray-700 border-b">
          {activeSection === "escalated" ? "Escalated Sessions" : activeSection === "bulk" ? "Bulk Orders" : "Archived Chats"}
        </div>
        <SessionList
          type={activeSection}
          onSelect={(sessionId) => setSelectedSession(sessionId)}
          selectedSessionId={selectedSession}
        />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">
        {selectedSession ? (
          <ChatWindow sessionId={selectedSession} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl shadow-md p-10 w-[400px] text-center space-y-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-700">No Chat Selected</h2>
              <p className="text-gray-600 text-sm">
                Please choose a session from the left panel to view and respond to messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;