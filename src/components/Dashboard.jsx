// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// // import LoginPage from './pages/LoginPage';
// // import SessionList from './components/SessionList';
// // import ChatWindow from './components/ChatWindow';
// import { MessageSquare } from 'lucide-react';


// function Dashboard() {
//   const [selectedSession, setSelectedSession] = useState(null);

//   return (
//     <div className="flex h-screen">
//       <SessionList
//         onSelect={(sessionId) => setSelectedSession(sessionId)}
//         selectedSessionId={selectedSession}
//       />
//       <div className="flex-1">
//         {selectedSession ? (
//           <ChatWindow sessionId={selectedSession} />
//         ) : (
//          <div className="flex items-center justify-center h-full bg-gray-50">
//             <div className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl shadow-md p-10 w-[400px] text-center space-y-4">
//               <MessageSquare className="h-12 w-12 text-gray-400" />
//               <h2 className="text-xl font-semibold text-gray-700">No Chat Selected</h2>
//               <p className="text-gray-600 text-sm">Please choose a session from the left panel to view and respond to messages.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


position: 'fixed',
bottom: '20px',
left: '20px',
background-color: '#e53935',
padding: '12px',
border-radius: '8px',
cursor: 'pointer',
transition: 'background-color 0.3s ease',