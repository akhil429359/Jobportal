import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddMembersModal from "./AddMembersModal";
import api from "../api/axios";

function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const res = await api.get(`group-chats/${id}/`);
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      const res = await api.post(`group-chats/${id}/leave/`);
      alert(res.data.detail);
      setGroup((prev) => ({ ...prev, is_member: false }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Cannot leave group");
    }
  };

  if (!group) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading group...</p>;

  const { image, group_name, admin_username, admin_id, description, is_member, is_admin } = group;

  return (
    <div style={styles.container}>
      {image && <img src={image} alt="Group" style={styles.image} />}
      <h2>{group_name}</h2>
      <p>Admin: {admin_username || admin_id?.username}</p>

      {description && (
        <p style={styles.description}>
          <strong>Description:</strong> {description}
        </p>
      )}

      <div style={styles.buttonContainer}>
        {is_member && (
          <>
            <button style={{ ...styles.button, background: "#4caf50" }} onClick={() => navigate(`/group-chat/${id}`)}>
              Enter Group Chat
            </button>
            <button style={{ ...styles.button, background: "#f44336" }} onClick={handleLeaveGroup}>
              Leave Group
            </button>
          </>
        )}

        {is_admin && (
          <button style={{ ...styles.button, background: "#2196f3" }} onClick={() => setShowAddMemberModal(true)}>
            Add Member
          </button>
        )}
      </div>

      {showAddMemberModal && (
        <AddMembersModal visible={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} groupId={id} />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    maxHeight: 250,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    color: "#555",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    maxHeight: 150,
    overflowY: "auto",
  },
  buttonContainer: { display: "flex", gap: 10 },
  button: {
    padding: "8px 12px",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default GroupDetailsPage;
