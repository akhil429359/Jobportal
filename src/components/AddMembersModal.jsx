import React, { useState, useEffect } from "react";
import api from "../api/axios";

function AddMembersModal({ groupId, visible, onClose }) {
  const [addableUsers, setAddableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (visible) fetchAddableUsers();
  }, [visible]);

  const fetchAddableUsers = async () => {
    try {
      const res = await api.get(`group-members/addable-users/?group=${groupId}`);
      setAddableUsers(res.data);
    } catch (err) {
      console.error("Error fetching addable users:", err);
      setAddableUsers([]);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      await api.post("group-members/", { group_id: groupId, user: selectedUserId });
      alert("User added to the group!");
      setSelectedUserId("");
      fetchAddableUsers();
      onClose();
    } catch (err) {
      console.error("Error adding member:", err);
      alert(err.response?.data?.detail || "Error adding member");
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 300 }}>
        <h3>Add Member</h3>

        <select onChange={(e) => setSelectedUserId(e.target.value)} style={{ width: "100%", marginBottom: 10 }} value={selectedUserId}>
          <option value="">Select a user</option>
          {addableUsers.map((user) => (
            <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
          ))}
        </select>

        <div>
          <button onClick={handleAddMember} style={{
            padding: "6px 12px",
            marginRight: 10,
            background: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}>Add</button>
          <button onClick={onClose} style={{
            padding: "6px 12px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddMembersModal;
