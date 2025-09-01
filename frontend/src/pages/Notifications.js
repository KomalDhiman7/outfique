import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // if you’re mixing with Supabase auth

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token"); // from login
      const res = await fetch("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔔 Notifications</h1>
      {notifications.length === 0 ? (
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
