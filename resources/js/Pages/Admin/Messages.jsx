import React from "react";
import AdminLayout from "@/Components/Admin/AdminLayout";

import { useState } from "react";

const sampleConversations = [
  {
    id: 1,
    name: "Anjie Co",
    lastMessage: "Thank you for your help!",
    unread: 2,
    messages: [
      { from: "them", text: "Hi, I need help with my order.", time: "09:00" },
      { from: "me", text: "Sure! What seems to be the problem?", time: "09:01" },
      { from: "them", text: "I received the wrong item.", time: "09:02" },
      { from: "me", text: "Sorry about that! Can you send a photo?", time: "09:03" },
      { from: "them", text: "Sure, here it is.", time: "09:04" },
      { from: "them", text: "Thank you for your help!", time: "09:05" },
    ],
  },
  {
    id: 2,
    name: "Jhaycee Bocarile",
    lastMessage: "Okay, thanks!",
    unread: 0,
    messages: [
      { from: "me", text: "Your account is now verified.", time: "10:00" },
      { from: "them", text: "Okay, thanks!", time: "10:01" },
    ],
  },
  {
    id: 3,
    name: "Rence Cababan",
    lastMessage: "Will do, thanks!",
    unread: 1,
    messages: [
      { from: "them", text: "How do I update my product info?", time: "11:00" },
      { from: "me", text: "Go to your dashboard and click 'Edit'.", time: "11:01" },
      { from: "them", text: "Will do, thanks!", time: "11:02" },
    ],
  },
];

export default function Messages() {
  const [selected, setSelected] = useState(sampleConversations[0]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSelected((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "me", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
    }));
    setInput("");
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: '#f5f6fa', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.07)', margin: '2.5rem 2rem 0 2rem', overflow: 'hidden' }}>
        {/* Sidebar: Conversation List */}
        <div style={{ width: 320, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: 20, color: '#2563eb' }}>Messages</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sampleConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelected(conv)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f3f4f6',
                  background: selected.id === conv.id ? '#f3f4f6' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: 18 }}>{conv.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{conv.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</div>
                </div>
                {conv.unread > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 12, fontSize: 12, padding: '2px 8px', fontWeight: 600 }}>{conv.unread}</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
          <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: 18, color: '#2563eb', background: '#fff' }}>{selected.name}</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selected.messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.from === 'me' ? '#2563eb' : '#fff',
                  color: msg.from === 'me' ? '#fff' : '#374151',
                  borderRadius: 16,
                  padding: '10px 18px',
                  maxWidth: 340,
                  fontSize: 15,
                  boxShadow: msg.from === 'me' ? '0 2px 8px rgba(37,99,235,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
                  marginLeft: msg.from === 'me' ? 40 : 0,
                  marginRight: msg.from === 'me' ? 0 : 40,
                  position: 'relative',
                }}>
                  {msg.text}
                  <span style={{ fontSize: 11, color: msg.from === 'me' ? '#dbeafe' : '#9ca3af', marginLeft: 10, position: 'absolute', right: 10, bottom: 4 }}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 12, padding: '1rem 1.5rem', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, borderRadius: 8, border: '1px solid #e5e7eb', padding: '10px 14px', fontSize: 15 }}
            />
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Send</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
