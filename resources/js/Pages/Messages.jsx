import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Messages = () => {
  // Placeholder for conversations
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // TODO: Fetch conversations from API
    setConversations([
      {
        id: 1,
        name: "Shop Owner",
        messages: [
          { from: "me", text: "Hi, I have a question." },
          { from: "them", text: "Sure, how can I help?" },
        ],
      },
    ]);
  }, []);

  const handleSend = () => {
    // TODO: Send message to API
    if (!message.trim()) return;
    // Update UI locally for demo
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConv.id
          ? { ...conv, messages: [...conv.messages, { from: "me", text: message }] }
          : conv
      )
    );
    setMessage("");
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "60vh", padding: "2rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: "2rem" }}>
          <aside style={{ width: 260, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(44,204,113,0.07)", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>Conversations</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {conversations.map((conv) => (
                <li key={conv.id} style={{ marginBottom: 10 }}>
                  <button
                    style={{
                      background: selectedConv?.id === conv.id ? "#2ECC71" : "#f7f8fa",
                      color: selectedConv?.id === conv.id ? "#fff" : "#222",
                      border: "none",
                      borderRadius: 8,
                      padding: "0.7rem 1.2rem",
                      width: "100%",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedConv(conv)}
                  >
                    {conv.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <section style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(44,204,113,0.07)", padding: "2rem" }}>
            {selectedConv ? (
              <>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>{selectedConv.name}</h3>
                <div style={{ minHeight: 220, marginBottom: 18 }}>
                  {selectedConv.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        textAlign: msg.from === "me" ? "right" : "left",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: msg.from === "me" ? "#2ECC71" : "#f7f8fa",
                          color: msg.from === "me" ? "#fff" : "#222",
                          borderRadius: 8,
                          padding: "0.6rem 1.1rem",
                          fontWeight: 500,
                          maxWidth: "70%",
                        }}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #eee", fontSize: 16 }}
                  />
                  <button
                    onClick={handleSend}
                    style={{ background: "#2ECC71", color: "#fff", border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "#888", fontSize: "1rem" }}>Select a conversation to start messaging.</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Messages;
