// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const SessionList = ({ type, onSelect, selectedSessionId }) => {
//   const [sessions, setSessions] = useState([]);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         if (type === "escalated") {
//           // Fetch escalated + unread sessions
//           const escalatedRes = await axios.get(
//             "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/escalated-sessions"
//           );
//           const unreadRes = await axios.get(
//             "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/unread/sessions"
//           );

//           const unreadMap = {};
//           unreadRes.data.forEach((item) => {
//             unreadMap[item.session_id] = item.unread_count;
//           });

//           const mergedSessions = escalatedRes.data.map((session) => ({
//             ...session,
//             unread_count: unreadMap[session.session_id] || 0,
//           }));

//           setSessions(mergedSessions);
//         } else if (type === "bulk") {
//           // Fetch bulk orders + unread sessions for bulk
//           const bulkRes = await axios.get(
//             "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/bulk-orders"
//           );
//           const bulkUnreadRes = await axios.get(
//             "http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/bulk-orders/unread"
//           );

//           const unreadMap = {};
//           bulkUnreadRes.data.forEach((item) => {
//             unreadMap[item.id] = item.unread_count; // bulk_orders_data.id
//           });

//           const mergedBulk = bulkRes.data.map((order) => ({
//             ...order,
//             unread_count: unreadMap[order.id] || 0,
//           }));

//           setSessions(mergedBulk);
//         }
//       } catch (err) {
//         console.error("Failed to fetch sessions:", err);
//       }
//     };

//     fetchSessions();
//     const interval = setInterval(fetchSessions, 10000);
//     return () => clearInterval(interval);
//   }, [type]);

//   return (
//     <div className="session-list p-4 h-full overflow-y-auto bg-white w-64">
//       {sessions.map((session) => {
//         const isSelected = session.session_id === selectedSessionId || session.id === selectedSessionId;

//         return (
//           <div
//             key={session.session_id || session.id}
//             onClick={() => onSelect(session.session_id || session.id)}
//             className={`flex flex-col px-4 py-2 rounded mb-2 cursor-pointer transition-colors ${
//               isSelected
//                 ? "bg-blue-100 text-blue-800 font-semibold"
//                 : "hover:bg-gray-200 text-gray-900"
//             }`}
//           >
//             {type === "escalated" ? (
//               // Escalated Session Row
//               <span className="flex items-center gap-2">
//                 🧾 {session.customer_name?.toUpperCase()}
//                 {session.unread_count > 0 && (
//                   <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
//                 )}
//               </span>
//             ) : (
//               // Bulk Orders Row
//               <>
//                 <span className="flex items-center gap-2">
//                   🛍️ {session.name?.toUpperCase() || session.phone_no}
//                   {session.unread_count > 0 && (
//                     <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
//                   )}
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   Product: {session.product_name}
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   Qty: {session.quantity}
//                 </span>
//               </>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SessionList;



import React, { useEffect, useState } from "react";
import axios from "axios";

const SessionList = ({ type, onSelect, selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [archiveData, setArchiveData] = useState({ bulkOrders: [], escalated: [] });
  const [archiveTab, setArchiveTab] = useState(null); // 'escalated' | 'bulk' | null

  // Reset inner tab whenever the outer tab changes
  useEffect(() => {
    if (type !== "archive") setArchiveTab(null);
  }, [type]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (type === "escalated") {
          // Escalated + unread
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
          // Bulk + unread
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
        } else if (type === "archive") {
          // Single API that returns both lists
          const res = await axios.get("http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/archive");
          // Expected shape: { escalated: [...], bulkOrders: [...] }
          setArchiveData(res.data || { escalated: [], bulkOrders: [] });
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [type]);

  // ----------------- ARCHIVE RENDER -----------------
  if (type === "archive") {
    const showEscalated = archiveTab === "escalated";
    const showBulk = archiveTab === "bulk";

    return (
      <div className="session-list p-4 h-full overflow-y-auto bg-white w-64 space-y-4">
        {/* Inner tabs for Archive */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              archiveTab === "escalated" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setArchiveTab("escalated")}
          >
            Escalated ({archiveData.escalated?.length || 0})
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              archiveTab === "bulk" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setArchiveTab("bulk")}
          >
            Bulk Orders ({archiveData.bulkOrders?.length || 0})
          </button>
        </div>

        {!archiveTab && (
          <p className="text-sm text-gray-500 font-semibold">
            Select a section above to view archived chats.
          </p>
        )}

        {/* Escalated archived list */}
        {showEscalated && (
          <div className="space-y-2">
            {archiveData.escalated?.length === 0 && (
              <p className="text-xs text-gray-400">No archived escalated chats</p>
            )}
            {archiveData.escalated?.map((session) => {
              const isSelected = session.session_id === selectedSessionId;
              return (
                <div
                  key={session.session_id}
                  onClick={() => onSelect(session.session_id)}
                  className={`px-3 py-2 rounded cursor-pointer ${
                    isSelected
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  🧾 {session.customer_name?.toUpperCase() || "Unknown"}
                </div>
              );
            })}
          </div>
        )}

        {/* Bulk Orders archived list */}
        {showBulk && (
          <div className="space-y-2">
            {archiveData.bulkOrders?.length === 0 && (
              <p className="text-xs text-gray-400">No archived bulk orders</p>
            )}
            {archiveData.bulkOrders?.map((order) => {
              const isSelected =
                (order.session_id || order.id) === selectedSessionId;
              return (
                <div
                  key={order.id}
                  onClick={() => onSelect(order.session_id || order.id)}
                  className={`px-3 py-2 rounded cursor-pointer ${
                    isSelected
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  🛍️ {order.name?.toUpperCase() || order.phone_no}
                  <div className="text-xs text-gray-600">
                    {order.product_name} × {order.quantity}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --------------- DEFAULT (ESCALATED / BULK) ---------------
  return (
    <div className="session-list p-4 h-full overflow-y-auto bg-white w-64">
      {sessions.map((session) => {
        const isSelected =
          session.session_id === selectedSessionId ||
          session.id === selectedSessionId;

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
              <span className="flex items-center gap-2">
                🧾 {session.customer_name?.toUpperCase()}
                {session.unread_count > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                )}
              </span>
            ) : (
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
