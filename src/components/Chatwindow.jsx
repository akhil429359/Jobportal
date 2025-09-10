import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ChatWindow() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await api.get("chats/");
      setMessages(res.data.filter(
        (msg) =>
          msg.sender_id === parseInt(userId) || msg.receiver_id === parseInt(userId)
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    try {
      await api.post("chats/", { receiver_id: userId, message });
      setMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg) => (
          <p key={msg.id}>
            <b>{msg.sender_id === parseInt(userId) ? "Friend" : "You"}:</b> {msg.message}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;
