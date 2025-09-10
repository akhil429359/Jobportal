// src/pages/GroupsListPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";
import debounce from "lodash.debounce";

function GroupsListPage({ currentUserId }) {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch groups from API
  const fetchGroups = async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("group-chats/", {
        params: { search: search || undefined },
      });

      // Check membership and admin
      const groupsWithFlags = res.data.map((group) => ({
        ...group,
        isAdmin: group.admin_id === currentUserId,
        isMember: group.members?.some((m) => m.user === currentUserId) || group.admin_id === currentUserId,
      }));

      setGroups(groupsWithFlags);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedFetchGroups = useCallback(
    debounce((value) => fetchGroups(value), 300),
    []
  );

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchGroups(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>All Groups</h2>

      {/* Search and Create */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: 5,
          }}
        />
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 12px",
            background: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Start a Group
        </button>
      </div>

      <CreateGroupModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          fetchGroups(searchTerm); // refresh after creating
        }}
      />

      {/* Group Cards */}
      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {groups.map((group) => (
            <div
              key={group.id}
              style={{
                width: 220,
                borderRadius: 10,
                padding: 14,
                background: "#f9f9faff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <div style={{ fontWeight: 700 }}>{group.group_name}</div>
              <div style={{ color: "#666" }}>Admin: {group.admin_username}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {group.isMember ? "Member" : "Not a member"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsListPage;
