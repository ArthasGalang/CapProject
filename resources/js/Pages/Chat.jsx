import React, { useEffect, useState } from 'react';

const Chat = ({ userId, otherId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    // Fetch chat history
    fetch(`/api/messages?sender_id=${userId}&other_id=${otherId}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
      });

    // Listen for new messages
    window.Echo.channel(`chat.${userId}`)
      .listen('MessageSent', (e) => {
        console.log('Received MessageSent event:', e);
        setMessages(msgs => [...msgs, e.message]);
      });

    // Cleanup
    return () => {
      window.Echo.leave(`chat.${userId}`);
    };
  }, [userId, otherId]);

  const sendMessage = async () => {
    // Add sent message to state immediately
    const newMsg = {
      SenderID: userId,
      MessageBody: input,
      MessageID: Date.now(), // Temporary unique ID
    };
    setMessages(msgs => [...msgs, newMsg]);
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ sender_id: userId, receiver_id: otherId, message: input })
    });
    setInput('');
  };

  return (
    <div>
      <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', marginBottom: 10 }}>
        {messages.map(msg => (
          <div key={msg.MessageID} style={{ textAlign: msg.SenderID === userId ? 'right' : 'left' }}>
            <b>{msg.SenderID === userId ? 'You' : 'Other'}:</b> {msg.MessageBody}
          </div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
