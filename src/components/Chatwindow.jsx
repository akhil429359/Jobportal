import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

function ChatWindow() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get("chats/");
      setMessages(res.data.filter((msg) => msg.sender_id === parseInt(userId) || msg.receiver_id === parseInt(userId)));
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await api.post("chats/", { receiver_id: userId, message });
      setMessage("");
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat</h2>
      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender_id === parseInt(userId) ? "flex-start" : "flex-end" }}>
            <div style={{ ...styles.message, backgroundColor: msg.sender_id === parseInt(userId) ? "#e5e5e5" : "#007bff", color: msg.sender_id === parseInt(userId) ? "#000" : "#fff" }}>
              {msg.message}
            </div>
            <span style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." style={styles.input} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
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
};

export default ChatWindow;
