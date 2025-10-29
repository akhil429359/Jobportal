import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare } from "lucide-react";
import api from "../api/axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("users/");
      const userData = Array.isArray(res.data) ? res.data[0] : res.data;
      if (userData?.id) {
        setCurrentUserId(Number(userData.id));
        localStorage.setItem("user_id", String(userData.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async (term = "") => {
    try {
      const res = await api.get("users/all_users/", { params: term ? { search: term } : {} });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await api.get("user-profiles/");
      setProfiles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get("connections/");
      setConnections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const res = await api.post("connections/", { receiver_id: userId });
      if (res.data?.id) setConnections((prev) => [...prev, res.data]);
      else fetchConnections();
    } catch (err) {
      console.error(err);
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
      console.error(err);
      fetchConnections();
    }
  };

  const updateConnectionStatus = async (connectionId, newStatus) => {
    try {
      await api.patch(`connections/${connectionId}/`, { status: newStatus });
      fetchConnections();
    } catch (err) {
      console.error(err);
      fetchConnections();
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
      await fetchUsers();
      await fetchProfiles();
      await fetchConnections();
      const interval = setInterval(fetchConnections, 5000);
      return () => clearInterval(interval);
    })();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchUsers(value);
  };

  const getProfileImage = (userId) => {
    const profile = profiles.find((p) => normalizeId(p.user) === userId);
    return profile?.profile_image || null;
  };

  const filteredUsers = users.filter((user) => {
    const uid = normalizeId(user.id);
    const connection = getConnection(uid);
    if (activeTab === "friends" || activeTab === "chats") {
      return connection && connection.status === "Accepted";
    }
    return true;
  });

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>User Directory</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
        {["all", "friends", "chats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              fontWeight: activeTab === tab ? "700" : "500",
              background: activeTab === tab ? "#4CAF50" : "#e8f5e9",
              color: activeTab === tab ? "white" : "#2e7d32",
              border: "2px solid #4CAF50",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab === "all" ? "All Users" : tab === "friends" ? "My Friends" : "My Chats"}
          </button>
        ))}
      </div>

      {activeTab !== "chats" && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: "8px", width: "250px", borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
        {filteredUsers.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>
            {activeTab === "friends" ? "No friends found." : activeTab === "chats" ? "No active chats." : "No users found."}
          </p>
        )}

        {filteredUsers.map((user) => {
          const uid = normalizeId(user.id);
          const connection = getConnection(uid);
          const status = connection ? connection.status : null;
          const iSent = connection && normalizeId(connection.requested_id) === currentUserId;
          const imageUrl = getProfileImage(uid);

          const avatar = imageUrl ? (
            <img src={imageUrl} alt={user.username} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }} />
          ) : (
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#4CAF50",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 24,
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              {user.username.charAt(0)}
            </div>
          );

          if (activeTab === "chats" && status === "Accepted") {
            return (
              <div key={uid} style={{
                width: 220,
                borderRadius: 10,
                padding: 14,
                background: "#f7f7f8",
                boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}>
                {avatar}
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{user.username}</div>
                <div style={{ color: "#666", marginBottom: 6 }}>{user.role}</div>
                <button
                  onClick={() => navigate(`/chat/${uid}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    width: "100%",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <MessageSquare size={18} />
                  Chat
                </button>
              </div>
            );
          }

          return (
            <div key={uid} style={{
              width: 220,
              borderRadius: 10,
              padding: 14,
              background: "#f7f7f8",
              boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
              {avatar}
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{user.username}</div>
              <div style={{ color: "#666", marginBottom: 6 }}>{user.role}</div>

              <button
                onClick={() => navigate(`/profile/${uid}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "10px 16px",
                  background: "#f1f8e9",
                  color: "#880661ff",
                  border: "2px solid #880661ff",
                  borderRadius: 10,
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  cursor: "pointer",
                  marginBottom: 14,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                <User size={22} />
                View Profile
              </button>

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
                    cursor: "pointer",
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
                      cursor: "pointer",
                    }}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <button
                      onClick={() => updateConnectionStatus(connection.id, "Accepted")}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateConnectionStatus(connection.id, "Rejected")}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
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
                    cursor: "pointer",
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
