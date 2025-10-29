import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleClick = async (notif) => {
    setShowDropdown(false);
    if (!notif.is_read) {
      try {
        await api.post("notifications/mark-read/", { id: notif.id });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
    if (notif.link) navigate(notif.link);
  };

  return (
    <div style={{ position: "relative", marginRight: 20 }}>
      <IoNotificationsOutline size={24} style={{ cursor: "pointer" }} onClick={() => setShowDropdown(!showDropdown)} />
      {unreadCount > 0 && (
        <span style={{ position: "absolute", top: -4, right: -4, background: "red", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 10 }}>
          {unreadCount}
        </span>
      )}
      {showDropdown && (
        <div style={{ position: "absolute", top: 30, right: 0, width: 300, maxHeight: 350, overflowY: "auto", border: "1px solid #ddd", borderRadius: 6, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 1000 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 10, textAlign: "center" }}>No notifications</div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} onClick={() => handleClick(notif)} style={{ padding: 10, borderBottom: "1px solid #eee", backgroundColor: notif.is_read ? "#fff" : "#e6f7ff", cursor: "pointer" }}>
                <div>{notif.message}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{new Date(notif.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
