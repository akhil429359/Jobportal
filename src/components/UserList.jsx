// src/pages/UserList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  // --- Helpers ---
  const normalizeId = (val) => {
    if (val == null) return null;
    if (typeof val === "object") return val.id ?? val.pk ?? null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  };

  const getConnection = (userId) => {
    if (!connections || !currentUserId) return undefined;
    return connections.find((c) => {
      const reqId = normalizeId(c.requested_id);
      const recvId = normalizeId(c.receiver_id);
      return (
        (reqId === currentUserId && recvId === userId) ||
        (reqId === userId && recvId === currentUserId)
      );
    });
  };

  // --- API Calls ---
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("users/");
      let userData = Array.isArray(res.data) ? res.data[0] : res.data;
      if (userData?.id) {
        setCurrentUserId(Number(userData.id));
        localStorage.setItem("user_id", String(userData.id));
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/all_users/");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching all_users:", err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get("connections/");
      setConnections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const res = await api.post("connections/", { receiver_id: userId });
      if (res.data?.id) setConnections((prev) => [...prev, res.data]);
      else fetchConnections();
    } catch (err) {
      console.error("Error sending friend request:", err);
      fetchConnections();
    }
  };

  const cancelFriendRequest = async (connectionId) => {
    try {
      await api.delete(`connections/${connectionId}/`);
      setConnections((prev) =>
        prev.filter((c) => normalizeId(c.id) !== normalizeId(connectionId))
      );
    } catch (err) {
      console.error("Error cancelling request:", err);
      fetchConnections();
    }
  };

  const updateConnectionStatus = async (connectionId, newStatus) => {
    try {
      await api.patch(`connections/${connectionId}/`, { status: newStatus });
      fetchConnections();
    } catch (err) {
      console.error("Error updating connection:", err);
      fetchConnections();
    }
  };

  // --- Lifecycle ---
  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
      await fetchUsers();
      await fetchConnections();
      const interval = setInterval(fetchConnections, 5000);
      return () => clearInterval(interval);
    })();
  }, []);

  // --- Render ---
  return (
    <div style={{ padding: 20 }}>
      <h2>All Users</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          marginTop: 16,
        }}
      >
        {users.map((user) => {
          const uid = normalizeId(user.id);
          const connection = getConnection(uid);
          const status = connection ? connection.status : null;
          const iSent =
            connection && normalizeId(connection.requested_id) === currentUserId;

          return (
            <div
              key={uid}
              style={{
                width: 220,
                borderRadius: 10,
                padding: 14,
                background: "#f7f7f8",
                boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {user.username}
              </div>
              <div style={{ color: "#666", marginBottom: 10 }}>{user.role}</div>

              {/* View Profile button */}
              <button
                onClick={() => navigate(`/profile/${uid}`)}
                style={{
                  padding: "6px 10px",
                  background: "#673ab7",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  marginBottom: 8,
                  width: "100%",
                }}
              >
                View Profile
              </button>

              {/* Friend Request / Chat buttons */}
              {status === "Accepted" ? (
                <button
                  onClick={() => navigate(`/chat/${uid}`)}
                  style={{
                    padding: "8px 12px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    width: "100%",
                  }}
                >
                  Chat
                </button>
              ) : status === "Pending" ? (
                iSent ? (
                  <button
                    onClick={() => cancelFriendRequest(connection.id)}
                    style={{
                      padding: "8px 12px",
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      width: "100%",
                    }}
                  >
                    Cancel Request
                  </button>
                ) : (
                  // Incoming request: show Accept / Reject
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        updateConnectionStatus(connection.id, "Accepted")
                      }
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        updateConnectionStatus(connection.id, "Rejected")
                      }
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={() => sendFriendRequest(uid)}
                  style={{
                    padding: "8px 12px",
                    background: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    width: "100%",
                  }}
                >
                  Send Friend Request
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
