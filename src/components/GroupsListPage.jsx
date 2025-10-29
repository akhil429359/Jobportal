import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import api from "../api/axios";
import CreateGroupModal from "./CreateGroupModal";

function GroupsListPage({ currentUserId }) {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMyGroupsOnly, setShowMyGroupsOnly] = useState(false);

  const navigate = useNavigate();

  const fetchGroups = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("group-chats/", { params: { search: search || undefined } });
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchGroups = useCallback(debounce(fetchGroups, 300), [fetchGroups]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchGroups(value);
  };

  const filteredGroups = showMyGroupsOnly ? groups.filter((g) => g.is_member) : groups;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Groups</h2>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.input}
        />
        <button
          onClick={() => setShowMyGroupsOnly(!showMyGroupsOnly)}
          style={{
            ...styles.button,
            background: showMyGroupsOnly ? "#673ab7" : "#2196f3",
          }}
        >
          {showMyGroupsOnly ? "Show All Groups" : "My Groups"}
        </button>
        <button onClick={() => setShowModal(true)} style={{ ...styles.button, background: "#4caf50" }}>
          Start a Group
        </button>
      </div>

      <CreateGroupModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          fetchGroups(searchTerm);
        }}
      />

      {loading ? (
        <p>Loading groups...</p>
      ) : filteredGroups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <div style={styles.groupList}>
          {filteredGroups.map((group) => {
            const { id, group_name, description, image, is_member } = group;

            return (
              <div key={id} style={styles.groupCard}>
                <div style={styles.groupInfo}>
                  {image && <img src={image} alt={group_name} style={styles.groupImage} />}
                  <div style={styles.groupText}>
                    <div style={styles.groupName}>{group_name}</div>
                    {description && <div style={styles.groupDescription}>{description}</div>}
                  </div>
                </div>

                {is_member ? (
                  <button
                    onClick={() => navigate(`/groups/${id}`)}
                    style={styles.viewButton}
                  >
                    View
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.post(`group-chats/${id}/join/`);
                        alert(res.data.detail);
                        fetchGroups(searchTerm);
                      } catch (err) {
                        alert(err.response?.data?.detail || "Could not join group");
                      }
                    }}
                    style={styles.joinButton}
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 20, maxWidth: 700, margin: "0 auto" },
  heading: { marginBottom: 16 },
  controls: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  input: { flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 5 },
  button: { padding: "8px 12px", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  groupList: { display: "flex", flexDirection: "column", gap: 12 },
  groupCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "12px 16px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    gap: 12,
  },
  groupInfo: { display: "flex", flex: 1, alignItems: "flex-start", gap: 12, minWidth: 0 },
  groupImage: { width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  groupText: { display: "flex", flexDirection: "column", minWidth: 0 },
  groupName: { fontWeight: 700, fontSize: 16, color: "#000", marginBottom: 4 },
  groupDescription: { fontSize: 13, color: "#555", wordBreak: "break-word" },
  viewButton: {
    padding: "6px 14px",
    border: "1px solid #0a66c2",
    color: "#0a66c2",
    borderRadius: 20,
    background: "transparent",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
  joinButton: {
    padding: "6px 14px",
    border: "none",
    background: "#0a66c2",
    color: "#fff",
    borderRadius: 20,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
};

export default GroupsListPage;
