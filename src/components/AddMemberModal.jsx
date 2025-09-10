import React, { useState, useEffect } from "react";
import api from "../api/axios";

function AddMembersModal({ groupId, adminId, visible, onClose }) {
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch admin's friends
  useEffect(() => {
    if (visible && adminId) fetchAdminFriends(adminId);
  }, [visible, adminId]);

  const fetchAdminFriends = async (adminId) => {
    try {
      const res = await api.get("connections/");
      const adminFriends = res.data
        .filter(
          (c) =>
            c.status === "Accepted" &&
            (c.requested_id_detail?.id === adminId || c.receiver_id_detail?.id === adminId)
        )
        .map((c) =>
          c.requested_id_detail?.id === adminId ? c.receiver_id_detail : c.requested_id_detail
        );

      setFriends(adminFriends);
    } catch (err) {
      console.error("Error fetching admin friends:", err);
      setFriends([]);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      await api.post("group-members/", {
        group_id: groupId,
        user: selectedUser.id,
      });
      alert(`${selectedUser.username} added to the group!`);
      onClose();
    } catch (err) {
      console.error("Error adding member:", err);
      alert(err.response?.data?.detail || "Error adding member");
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          width: 300,
        }}
      >
        <h3>Add Member</h3>

        <select
          onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}
          style={{ width: "100%", marginBottom: 10 }}
          value={selectedUser ? JSON.stringify(selectedUser) : ""}
        >
          <option value="">Select a friend</option>
          {friends.map((f) => (
            <option key={f.id} value={JSON.stringify(f)}>
              {f.username} ({f.role})
            </option>
          ))}
        </select>

        <div>
          <button
            onClick={handleAddMember}
            style={{
              padding: "6px 12px",
              marginRight: 10,
              background: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Add
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              background: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMembersModal;
