import React, { useState } from 'react';
import Chat from './Chat';

// Dummy user IDs for testing
const CURRENT_USER_ID = 1; // Replace with actual logged-in user ID
const OTHER_USER_ID = 2;   // Replace with another user ID to chat with

const ChatTest = () => {
  const [userId, setUserId] = useState(CURRENT_USER_ID);
  const [otherId, setOtherId] = useState(OTHER_USER_ID);

  

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #eee', borderRadius: 10, background: '#fafafa' }}>
      <h2>Real-Time Chat Test</h2>
      <div style={{ marginBottom: 20 }}>
        <label>
          Your User ID:
          <input type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} style={{ marginLeft: 10 }} />
        </label>
        <br />
        <label>
          Chat With User ID:
          <input type="number" value={otherId} onChange={e => setOtherId(Number(e.target.value))} style={{ marginLeft: 10 }} />
        </label>
      </div>
      <Chat userId={userId} otherId={otherId} />
    </div>
  );
};

export default ChatTest;
