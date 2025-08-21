// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { LogOut } from 'lucide-react';

// // const App = () => {
// //   return (
// //     <LogOut />
// //   );
// // };


// const SessionList = ({ onSelect, selectedSessionId }) => {
//   const [sessions, setSessions] = useState([]);
//   const navigate = useNavigate();
//   const handleLogout=()=>{
//     navigate("/");
//     localStorage.removeItem("isAuthenticate");
//   }

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const escalatedRes = await axios.get('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/escalated-sessions');
//         const unreadRes = await axios.get('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/unread/sessions');

//         const escalatedSessions = escalatedRes.data;

//         // ✅ Convert unread array to map
//         const unreadMap = {};
//         unreadRes.data.forEach(item => {
//           unreadMap[item.session_id] = item.unread_count;
//         });

//         const mergedSessions = escalatedSessions.map((session) => ({
//           ...session,
//           unread_count: unreadMap[session.session_id] || 0,
//         }));

//         setSessions(mergedSessions);
//       } catch (err) {
//         console.error('Failed to fetch sessions or unread counts:', err);
//       }
//     };

//     fetchSessions();
//     const interval = setInterval(fetchSessions, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//     <div className="session-list p-4 border-r h-screen overflow-y-auto bg-white w-64">
//       <h2 className="text-lg font-bold mb-4">Escalated Sessions</h2>
//       {sessions.map((session) => {
//         const isSelected = session.session_id === selectedSessionId;
//         return (
//           <div
//             key={session.session_id}
//             onClick={() => onSelect(session.session_id)}
//             className={`flex items-center justify-between px-4 py-2 rounded mb-2 cursor-pointer transition-colors ${
//               isSelected
//                 ? 'bg-blue-100 text-blue-800 font-semibold'
//                 : 'hover:bg-gray-200 text-gray-900'
//             }`}
//           >
//             <span className="flex items-center gap-2">
//               🧾 {session.customer_name.toUpperCase()}
//               {session.unread_count > 0 && (
//                 <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
//               )}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//     <button
//       onClick={handleLogout}
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         left: '50px',
//         width:'150px',
//         display:'flex',
//         justifyContent:'center',
//         alignContent:'center',
//         alignItems:'center',
//         backgroundColor: '#e53935',
//         color: '#fff',
//         padding: '10px',
//         borderRadius: '10px',
//         cursor: 'pointer',
//         transition: 'backgroundColor 0.3s ease',
//         fontSize:'18px',
//         fontFamily: 'monospace'
//       }}
//       className='my-auto'
//     >
//     <LogOut className='my-auto' size={20}/>
//       <span className='ml-2'>Logout</span>
//     </button>
//     </>
//   );
// };
 
// export default SessionList;



import React, { useEffect, useState } from "react";
import axios from "axios";

const SessionList = ({ type, onSelect, selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (type === "escalated") {
          // Fetch escalated + unread sessions
          const escalatedRes = await axios.get(
            "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/escalated-sessions"
          );
          const unreadRes = await axios.get(
            "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/unread/sessions"
          );

          const unreadMap = {};
          unreadRes.data.forEach((item) => {
            unreadMap[item.session_id] = item.unread_count;
          });

          const mergedSessions = escalatedRes.data.map((session) => ({
            ...session,
            unread_count: unreadMap[session.session_id] || 0,
          }));

          setSessions(mergedSessions);
        } else if (type === "bulk") {
          // Fetch bulk orders + unread sessions for bulk
          const bulkRes = await axios.get(
            "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/bulk-orders"
          );
          const bulkUnreadRes = await axios.get(
            "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/bulk-orders/unread"
          );

          const unreadMap = {};
          bulkUnreadRes.data.forEach((item) => {
            unreadMap[item.id] = item.unread_count; // bulk_orders_data.id
          });

          const mergedBulk = bulkRes.data.map((order) => ({
            ...order,
            unread_count: unreadMap[order.id] || 0,
          }));

          setSessions(mergedBulk);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="session-list p-4 h-full overflow-y-auto bg-white w-64">
      {sessions.map((session) => {
        const isSelected = session.session_id === selectedSessionId || session.id === selectedSessionId;

        return (
          <div
            key={session.session_id || session.id}
            onClick={() => onSelect(session.session_id || session.id)}
            className={`flex flex-col px-4 py-2 rounded mb-2 cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "hover:bg-gray-200 text-gray-900"
            }`}
          >
            {type === "escalated" ? (
              // Escalated Session Row
              <span className="flex items-center gap-2">
                🧾 {session.customer_name?.toUpperCase()}
                {session.unread_count > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                )}
              </span>
            ) : (
              // Bulk Orders Row
              <>
                <span className="flex items-center gap-2">
                  🛍️ {session.name?.toUpperCase() || session.phone_no}
                  {session.unread_count > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                  )}
                </span>
                <span className="text-sm text-gray-600">
                  Product: {session.product_name}
                </span>
                <span className="text-sm text-gray-600">
                  Qty: {session.quantity}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SessionList;