import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddMembersModal from "./AddMembersModal";
import api from "../api/axios";

function GroupDetailsPage() {
  const { id } = useParams(); // group id
  const [group, setGroup] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("users/"); // current user endpoint
        const userData = Array.isArray(res.data) ? res.data[0] : res.data;
        setCurrentUserId(userData.id);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch group and members
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`group-chats/${id}/`);
        setGroup(res.data);

        // check membership
        const membersRes = await api.get(`group-members/?group_id=${id}`);
        const memberIds = membersRes.data.map((m) => m.user.id);
        if (memberIds.includes(currentUserId) || res.data.admin_id?.id === currentUserId) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    if (currentUserId) fetchGroup();
  }, [id, currentUserId]);

  if (!group) return <p>Loading group...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{group.group_name}</h2>
      <p>Admin: {group.admin_id?.username}</p>

      {/* Group chat button only for members */}
      {isMember && (
        <button
          onClick={() => navigate(`/group-chat/${group.id}`)}
          style={{
            marginRight: 10,
            padding: "8px 12px",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Enter Group Chat
        </button>
      )}

      {/* Add Member button only for admin */}
      {currentUserId && group.admin_id?.id === currentUserId && (
        <button
          onClick={() => setShowAddMemberModal(true)}
          style={{
            padding: "8px 12px",
            background: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add Member
        </button>
      )}

      <AddMembersModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        groupId={group.id}
        adminId={group.admin_id?.id}
      />
    </div>
  );
}

export default GroupDetailsPage;
