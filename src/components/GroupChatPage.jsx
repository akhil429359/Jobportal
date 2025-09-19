import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function GroupChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("auth/user/");
      setCurrentUser(res?.data?.id ?? res?.data?.user_id ?? res?.data?.user?.id);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`group-messages/?group=${id}`);
      setMessages(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post("group-messages/", { group: id, message: newMessage });
      setNewMessage("");
      await fetchMessages();
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (loading) return <p style={styles.center}>Loading messages...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Group Chat</h2>
      <div style={styles.chatBox}>
        {messages.length === 0 && <p style={styles.empty}>No messages yet. Start the conversation!</p>}
        {messages.map((msg) => {
          const senderId = msg.sender_id ?? msg.sender?.id ?? msg.sender;
          const isOwnMessage = currentUser != null && Number(senderId) === Number(currentUser);
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isOwnMessage ? "flex-end" : "flex-start" }}>
              {!isOwnMessage && <strong style={styles.sender}>{msg.sender_username ?? msg.sender?.username ?? "Member"}</strong>}
              <div style={{ ...styles.message, backgroundColor: isOwnMessage ? "#007bff" : "#e5e5e5", color: isOwnMessage ? "#fff" : "#000" }}>{msg.message}</div>
              <span style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={styles.input} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    height: "300px",
    overflowY: "auto",
    background: "#fafafa",
  },
  message: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: "16px",
    wordWrap: "break-word",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "3px",
  },
  sender: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    marginBottom: "2px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: "40px",
  },
  center: { textAlign: "center", marginTop: "30px" },
};

export default GroupChatPage;
