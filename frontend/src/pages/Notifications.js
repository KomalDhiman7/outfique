import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { fetchNotifications } from "../api/notificationsApi";

function Notifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const res = await fetchNotifications(token);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
      setLoading(false);
    }
    if (token) getData();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔔 Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 rounded-2xl shadow bg-white flex justify-between"
            >
              <span>{n.message}</span>
              <span className="text-sm text-gray-400">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
