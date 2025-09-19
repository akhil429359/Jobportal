import React, { useState } from "react";
import api from "../api/axios";

function CreateGroupModal({ visible, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Group name is required");
      return;
    }
    const formData = new FormData();
    formData.append("group_name", name);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);
    try {
      setLoading(true);
      await api.post("group-chats/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onClose();
      setName("");
      setDescription("");
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 24, borderRadius: 12, width: 340, boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }}>
        <h3 style={{ marginBottom: 16, textAlign: "center" }}>Create a Group</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Name" style={{ width: "100%", marginBottom: 12, padding: "10px", border: "1px solid #ccc", borderRadius: 8 }} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Group Description (optional)" rows={3} style={{ width: "100%", marginBottom: 12, padding: "10px", border: "1px solid #ccc", borderRadius: 8, resize: "vertical" }} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginBottom: 12 }} />
        {image && (
          <div style={{ marginBottom: 12, textAlign: "center" }}>
            <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: "100%", maxHeight: 180, borderRadius: 8, objectFit: "cover" }} />
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} disabled={loading} style={{ background: "#ddd", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleCreate} disabled={loading} style={{ background: "#4caf50", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Creating..." : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;
