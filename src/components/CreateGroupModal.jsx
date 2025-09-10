import React, { useState } from "react";
import api from "../api/axios";

function CreateGroupModal({ visible, onClose }) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    try {
      await api.post("group-chats/", { group_name: name });
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating group");
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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 300 }}>
        <h3>Create a Group</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={handleCreate} style={{ marginRight: 10 }}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default CreateGroupModal;
