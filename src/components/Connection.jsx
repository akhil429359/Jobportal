import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

function Connection() {
  const [connections, setConnections] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await api.get("connections/");
      const allConnections = res.data || [];
      setConnections(allConnections.filter((c) => c.status === "Accepted"));
      setFriendRequests(allConnections.filter((c) => c.status === "Pending"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id, action) => {
    try {
      await api.patch(`connections/${id}/`, { status: action });
      fetchConnections();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  const notifUserId = new URLSearchParams(location.search).get("request_user");

  if (loading) return <p>Loading connections...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Connections</h2>
      <div style={{ marginBottom: 30 }}>
        <h3>Friend Requests</h3>
        {friendRequests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          friendRequests.map((req) => {
            const user = req.requested_id?.id !== undefined ? req.requested_id : req.receiver_id;
            const highlight = notifUserId && parseInt(notifUserId) === user.id;
            return (
              <div key={req.id} style={{ border: highlight ? "2px solid #2196f3" : "1px solid #ddd", padding: 10, marginBottom: 10, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: highlight ? "#e6f7ff" : "#fff" }}>
                <div>{user.username || "Unknown User"} sent you a friend request</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => navigate(`/profile/${user.id}`)} style={{ padding: "4px 10px", background: "#e8f5e9", color: "#2e7d32", border: "2px solid #4caf50", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>View Profile</button>
                  <button onClick={() => handleRequest(req.id, "Accepted")} style={{ padding: "4px 8px", background: "#4caf50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Accept</button>
                  <button onClick={() => handleRequest(req.id, "Rejected")} style={{ padding: "4px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div>
        <h3>My Connections</h3>
        {connections.length === 0 ? (
          <p>No connections yet</p>
        ) : (
          connections.map((conn) => {
            const user = conn.requested_id?.id !== undefined ? conn.requested_id : conn.receiver_id;
            return (
              <div key={conn.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{user.username || "Unknown User"}</span>
                <button onClick={() => navigate(`/profile/${user.id}`)} style={{ padding: "4px 10px", background: "#e8f5e9", color: "#2e7d32", border: "2px solid #4caf50", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>View Profile</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Connection;
