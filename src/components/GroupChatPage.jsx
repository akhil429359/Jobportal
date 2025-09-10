import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function GroupChatPage() {
  const { id } = useParams(); // group ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch messages for the group
  const fetchMessages = async () => {
    try {
      const res = await api.get(`group-messages/?group=${id}`);
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post("group-messages/", { group: id, message: newMessage });
      setNewMessage("");
      fetchMessages(); // refresh messages immediately
    } catch (err) {
      alert(err.response?.data?.detail || "Error sending message");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Group Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          height: 400,
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            <strong>{msg.sender_username}:</strong> {msg.message}
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "80%", padding: 8 }}
        />
        <button
          onClick={handleSendMessage}
          style={{ padding: "8px 12px", marginLeft: 8, background: "#4caf50", color: "white", border: "none", borderRadius: 4 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default GroupChatPage;
