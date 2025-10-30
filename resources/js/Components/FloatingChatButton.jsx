
import React, { useState, useRef, useEffect } from 'react';
import ReportProductButton from './ReportProductButton';

const FloatingChatButton = () => {
  // Modal state for starting new chat
  const [showUserIdModal, setShowUserIdModal] = useState(false);
  const [newUserIdInput, setNewUserIdInput] = useState('');
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatUsers, setChatUsers] = useState({});
  const messagesEndRef = useRef(null);

  // Check if user is logged in
  let isLoggedIn = false;
  try {
    isLoggedIn = !!localStorage.getItem('user');
  } catch (e) {
    isLoggedIn = false;
  }

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Fetch available chats for the current user when chat opens
  useEffect(() => {
    if (!open) return;
    let userId = null;
    try {
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      userId = userData && (userData.UserID || userData.id);
    } catch (e) { userId = null; }
    if (!userId) return;
    // Fetch chats
  fetch(`/api/usermessages?user_id=${userId}`)
      .then(res => res.json())
      .then(async data => {
        // Group chats by unique user (other than current user) if there is at least one message between them
        const chatMap = {};
        const userIds = new Set();
        data.forEach(msg => {
          // Find the other user in the message
          const otherId = msg.SenderID === userId ? msg.ReceiverID : msg.SenderID;
          if (!chatMap[otherId]) chatMap[otherId] = { otherId, messages: [] };
          chatMap[otherId].messages.push(msg);
          userIds.add(otherId);
        });
        // Sort chats by most recent message timestamp
        const sortedChats = Object.values(chatMap).sort((a, b) => {
          const lastMessageA = a.messages[a.messages.length - 1];
          const lastMessageB = b.messages[b.messages.length - 1];
          const timeA = lastMessageA?.created_at ? new Date(lastMessageA.created_at).getTime() : 0;
          const timeB = lastMessageB?.created_at ? new Date(lastMessageB.created_at).getTime() : 0;
          return timeB - timeA; // Most recent first
        });
        setChats(sortedChats);
        // Fetch user info for each chat
        const userInfoMap = {};
        await Promise.all(Array.from(userIds).map(async id => {
          try {
            const res = await fetch(`/api/user/${id}`);
            if (res.ok) {
              const user = await res.json();
              userInfoMap[id] = user;
            }
          } catch {}
        }));
        setChatUsers(userInfoMap);
        // Set active chat if not set
        if (Object.values(chatMap).length > 0 && !activeChat && !showAnnouncements) {
          setActiveChat(Object.values(chatMap)[0].otherId);
        }
      })
      .catch(() => setChats([]));
    // Fetch announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched announcements:', data);
        let userId = null;
        try {
          const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
          userId = userData && (userData.UserID || userData.id);
        } catch (e) { userId = null; }
        // Filter announcements
        const filtered = Array.isArray(data) ? data.filter(a => {
          if (!a.ReceiverIDs || a.ReceiverIDs.length === 0) return true;
          let receiverIds = [];
          try {
            receiverIds = typeof a.ReceiverIDs === 'string' ? JSON.parse(a.ReceiverIDs) : a.ReceiverIDs;
          } catch (e) {}
          return receiverIds.length === 0 || (userId && receiverIds.includes(Number(userId)));
        }) : [];
        setAnnouncements(filtered);
      })
      .catch(() => setAnnouncements([]));
  }, [open]);

  // Fetch messages for the selected chat and listen for real-time updates
  useEffect(() => {
    if (!open || showAnnouncements) return;
    if (!activeChat) return;
    let userId = null;
    try {
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      userId = userData && (userData.UserID || userData.id);
    } catch (e) { userId = null; }
    if (!userId) return;
    setLoadingMessages(true);
    fetch(`/api/usermessages?sender_id=${userId}&other_id=${activeChat}`)
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoadingMessages(false);
      })
      .catch(() => {
        setMessages([]);
        setLoadingMessages(false);
      });

    // Listen for new messages in real time
    if (window.Echo) {
      window.Echo.channel(`chat.${userId}`)
        .listen('UserMessageSent', async (e) => {
          console.log('Received UserMessageSent event:', e);
          const senderId = e.message.SenderID;
          const receiverId = e.message.ReceiverID;
          const otherId = senderId === userId ? receiverId : senderId;
          let chatExists = false;
          setChats(prevChats => {
            chatExists = prevChats.some(chat => chat.otherId === otherId);
            if (chatExists) {
              // Update existing chat and move to top
              const updatedChats = prevChats.map(chat => {
                if (chat.otherId === otherId) {
                  return {
                    ...chat,
                    messages: [...chat.messages, e.message]
                  };
                }
                return chat;
              });
              // Sort by most recent message
              return updatedChats.sort((a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1];
                const lastMessageB = b.messages[b.messages.length - 1];
                const timeA = lastMessageA?.created_at ? new Date(lastMessageA.created_at).getTime() : 0;
                const timeB = lastMessageB?.created_at ? new Date(lastMessageB.created_at).getTime() : 0;
                return timeB - timeA;
              });
            } else {
              return [
                { otherId, messages: [e.message] },
                ...prevChats
              ];
            }
          });
          // If chat did not exist, fetch user info and add to chatUsers
          if (!chatExists) {
            try {
              const res = await fetch(`/api/user/${otherId}`);
              if (res.ok) {
                const user = await res.json();
                setChatUsers(prev => ({ ...prev, [otherId]: user }));
              }
            } catch {}
          }
          // Only add messages for the active chat
          if (
            (e.message.SenderID === userId && e.message.ReceiverID === activeChat) ||
            (e.message.SenderID === activeChat && e.message.ReceiverID === userId)
          ) {
            setMessages(msgs => [...msgs, e.message]);
          }
        });
    }
    // Cleanup
    return () => {
      if (window.Echo) window.Echo.leave(`chat.${userId}`);
    };
  }, [open, activeChat, showAnnouncements]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    let userId = null;
    try {
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      userId = userData && (userData.UserID || userData.id);
    } catch (e) { userId = null; }
    if (!userId) return;
    // Add sent message to state immediately (optimistic UI)
    const newMsg = {
      SenderID: userId,
      ReceiverID: activeChat,
      MessageBody: input,
      MessageID: Date.now(), // Temporary unique ID
    };
    setMessages(msgs => [...msgs, newMsg]);
  await fetch('/api/usermessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ sender_id: userId, receiver_id: activeChat, message: input })
    });
    setInput('');
  };

  // If user is not logged in, don't render the component
  if (!isLoggedIn) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          if (!activeChat) {
            setShowAnnouncements(true);
          }
        }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: 'none',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        aria-label="Open chat"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Modal for entering UserID to start new chat */}
      {showUserIdModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px #2222',
            padding: '2rem 2.5rem',
            minWidth: 320,
            textAlign: 'center',
            position: 'relative',
          }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Start New Chat</h2>
            <div style={{ marginBottom: '1.2rem' }}>
              <input
                type="number"
                value={newUserIdInput}
                onChange={e => setNewUserIdInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter UserID"
                style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #ccc', width: '100%', fontSize: 16 }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                style={{ background: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: 16, padding: '0.6rem 2rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                onClick={async () => {
                  let userId = null;
                  try {
                    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                    userId = userData && (userData.UserID || userData.id);
                  } catch (e) { userId = null; }
                  const receiverId = newUserIdInput;
                  if (!receiverId || isNaN(receiverId)) return;
                  if (Number(receiverId) === Number(userId)) {
                    window.alert('You cannot start a chat with yourself.');
                    return;
                  }
                  // Check if chat already exists
                  const exists = chats.some(chat => Number(chat.otherId) === Number(receiverId));
                  if (exists) {
                    setActiveChat(Number(receiverId));
                    setShowAnnouncements(false);
                    setShowUserIdModal(false);
                    setNewUserIdInput('');
                    return;
                  }
                  // Fetch user info for the entered ID
                  let userInfo = null;
                  try {
                    const res = await fetch(`/api/user/${receiverId}`);
                    if (res.ok) userInfo = await res.json();
                  } catch {}
                  // Add to chatUsers and chats temporarily
                  if (userInfo) {
                    setChatUsers(prev => ({ ...prev, [receiverId]: userInfo }));
                  }
                  setChats(prev => [
                    { otherId: Number(receiverId), messages: [] },
                    ...prev
                  ]);
                  setActiveChat(Number(receiverId));
                  setShowAnnouncements(false);
                  setShowUserIdModal(false);
                  setNewUserIdInput('');
                }}
              >Start Chat</button>
              <button
                style={{ background: '#eee', color: '#222', fontWeight: 600, fontSize: 16, padding: '0.6rem 2rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setShowUserIdModal(false);
                  setNewUserIdInput('');
                }}
              >Cancel</button>
            </div>
            <button
              style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
              onClick={() => {
                setShowUserIdModal(false);
                setNewUserIdInput('');
              }}
              aria-label="Close"
            >×</button>
          </div>
        </div>
      )}

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          width: 640,
          height: 600,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 16px 64px rgba(0,0,0,0.25)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--color-primary)',
            color: '#fff',
            padding: '1rem 1.2rem',
            fontWeight: 700,
            fontSize: '1.08rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>
              Chat Support
              <span style={{marginLeft:12, fontWeight:500, fontSize:'0.98rem', color:'#e6ffe6'}}>
                ({chats.length} available chats)
              </span>
            </span>
            <button onClick={() => setOpen(false)} style={{background:'none', border:'none', color:'#fff', fontSize:22, cursor:'pointer', marginLeft:8}} title="Close">×</button>
          </div>
          <div style={{display:'flex', flex:1, minHeight:0}}>
            {/* Sidebar: Available chats for user */}
            <div style={{width:180, background:'#f3f3f3', borderRight:'1px solid #eee', padding:'1rem 0.5rem', display:'flex', flexDirection:'column'}}>
              <div style={{fontWeight:600, fontSize:15, marginBottom:8, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center'}}>
                Chats
                <button
                  title="Start new chat"
                  style={{marginLeft:8, background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:6, width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer'}}
                  onClick={() => setShowUserIdModal(true)}
                >
                  +
                </button>
              </div>
              {/* Announcements selection */}
              <div
                style={{
                  padding: '10px 0',
                  color: showAnnouncements ? 'var(--color-primary)' : '#555',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 6,
                  background: showAnnouncements ? '#e6ffe6' : '#e6e6e6',
                  marginBottom: 6,
                  fontWeight: showAnnouncements ? 700 : 500,
                  border: showAnnouncements ? '2px solid var(--color-primary)' : 'none',
                }}
                onClick={() => {
                  setShowAnnouncements(true);
                  setActiveChat(null);
                }}
              >
              Announcements
              </div>
              {/* Separator */}
              <div style={{
                borderBottom: '1.5px solid #ccc',
                margin: '8px 0 10px 0',
                width: '90%',
                alignSelf: 'center',
              }} />
              <ul style={{
                listStyle:'none',
                margin:0,
                padding:0,
                maxHeight:320,
                overflowY:'auto',
                scrollbarWidth:'thin',
                scrollbarColor:'#ccc #f3f3f3'
              }}>
                {chats.length === 0 ? (
                  <li style={{padding:'8px 0', color:'#888', textAlign:'center'}}>No chats found.</li>
                ) : (
                  chats.map(chat => {
                    const user = chatUsers[chat.otherId];
                    const name = user
                      ? `${user.FirstName || ''} ${user.LastName || ''}`.trim()
                      : 'Loading...';
                    // Check for unread messages where current user is receiver and IsRead is false
                    let userId = null;
                    try {
                      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                      userId = userData && (userData.UserID || userData.id);
                    } catch (e) { userId = null; }
                    const hasUnread = chat.messages.some(msg => msg.ReceiverID === userId && msg.IsRead === 0);
                    return (
                      <li
                        key={chat.otherId}
                        title={`UserID: ${chat.otherId}`}
                        style={{
                          padding:'10px 0',
                          color: (!showAnnouncements && activeChat === chat.otherId) ? 'var(--color-primary)' : '#555',
                          textAlign:'center',
                          cursor:'pointer',
                          borderRadius:6,
                          background: hasUnread
                            ? '#ffeaea'
                            : (!showAnnouncements && activeChat === chat.otherId)
                              ? '#e6ffe6'
                              : '#e6e6e6',
                          border: hasUnread ? '2px solid #ffb3b3' : '2px solid #b6e6b6',
                          marginBottom:6,
                          fontWeight: (!showAnnouncements && activeChat === chat.otherId) ? 700 : 500,
                          position: 'relative'
                        }}
                        onClick={async () => {
                          setActiveChat(chat.otherId);
                          setShowAnnouncements(false);
                          // Mark unread messages as read for this chat
                          let userId = null;
                          try {
                            const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                            userId = userData && (userData.UserID || userData.id);
                          } catch (e) { userId = null; }
                          // Find unread messages for this chat where current user is receiver
                          const unreadMsgIds = chat.messages
                            .filter(msg => msg.ReceiverID === userId && msg.IsRead === 0)
                            .map(msg => msg.UserMessageID);
                          if (unreadMsgIds.length > 0) {
                            await fetch('/api/usermessages/read', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                              },
                              body: JSON.stringify({ ids: unreadMsgIds })
                            });
                            // Update local chat state for real-time UI
                            setChats(prevChats => prevChats.map(c => {
                              if (c.otherId !== chat.otherId) return c;
                              return {
                                ...c,
                                messages: c.messages.map(msg =>
                                  unreadMsgIds.includes(msg.UserMessageID)
                                    ? { ...msg, IsRead: 1, ReadAt: new Date().toISOString() }
                                    : msg
                                )
                              };
                            }));
                          }
                        }}
                      >
                        {name}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            {/* Messages + Input */}
            <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0}}>
              <div style={{flex:1, padding:'1rem', overflowY:'auto', background:'#f7f7f7', minWidth:0}}>
                {showAnnouncements ? (
                  announcements.length === 0 ? (
                    <div style={{color:'#888', textAlign:'center', marginTop:40}}>No announcements yet.</div>
                  ) : (
                    announcements.map((a, idx) => (
                      <div key={a.id || idx} style={{
                        marginBottom: 18,
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          background: '#fffbe6',
                          color: '#b8860b',
                          border: '1.5px solid #ffe066',
                          borderRadius: 12,
                          padding: '12px 18px',
                          maxWidth: '90%',
                          fontSize: 15,
                          fontWeight: 600,
                          boxShadow: '0 2px 8px #ffe06644',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}>
                          {/* Title */}
                          {a.title && <div style={{fontWeight:700, marginBottom:4, fontSize:16}}>{a.title}</div>}
                          {/* Content/body/message */}
                          <div style={{marginBottom:6, whiteSpace:'pre-line'}}>{a.Content || ''}</div>
                          {/* Date */}
                          {a.created_at && <div style={{fontSize:12, color:'#b8860b99', marginTop:2}}>{new Date(a.created_at).toLocaleString()}</div>}
                        </div>
                      </div>
                    ))
                  )
                ) : loadingMessages ? (
                  <div style={{textAlign:'center', marginTop:40}}>
                    <div className="chat-loading-spinner" style={{display:'inline-block', width:40, height:40, border:'4px solid #eee', borderTop:'4px solid #22c55e', borderRadius:'50%', animation:'spin 1s linear infinite'}}></div>
                    <div style={{color:'#888', marginTop:12}}>Loading messages...</div>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (() => {
                  let userId = null;
                  try {
                    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
                    userId = userData && (userData.UserID || userData.id);
                  } catch (e) { userId = null; }
                  // Only show messages between userId and activeChat
                  const filtered = messages.filter(msg =>
                    (msg.SenderID === userId && msg.ReceiverID === activeChat) ||
                    (msg.SenderID === activeChat && msg.ReceiverID === userId)
                  );
                  if (filtered.length === 0) {
                    return <div style={{color:'#888', textAlign:'center', marginTop:40}}>No messages yet.</div>;
                  }
                  return filtered.map((msg, idx) => {
                    const isUser = msg.SenderID === userId;
                    return (
                      <div key={msg.MessageID || idx} style={{
                        marginBottom: 10,
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                      }}>
                        <div style={{
                          background: isUser ? 'var(--color-primary)' : '#e6e6e6',
                          color: isUser ? '#fff' : '#222',
                          borderRadius: 12,
                          padding: '8px 14px',
                          maxWidth: '70%',
                          fontSize: 15,
                          fontWeight: 500,
                          boxShadow: isUser ? '0 2px 8px #22c55e22' : '0 2px 8px #aaa2',
                        }}>
                          {msg.MessageBody}
                        </div>
                      </div>
                    );
                  });
                })()}
                <div ref={messagesEndRef} />
              </div>
              {/* Input: only show if not announcements */}
              {!showAnnouncements && (
                <form onSubmit={e => {e.preventDefault(); sendMessage();}} style={{display:'flex', padding:'0.8rem', borderTop:'1px solid #eee', background:'#fff', position: 'relative'}}>
                  {activeChat && (
                    <div style={{ position: 'absolute', top: '-50px', right: '10px' }}>
                      <ReportProductButton productId={activeChat} />
                    </div>
                  )}
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{flex:1, padding:'10px 12px', borderRadius:8, border:'1px solid #e6e6e6', fontSize:15, marginRight:8}}
                    autoFocus
                  />
                  <button type="submit" style={{background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:8, padding:'0 18px', fontWeight:700, fontSize:15, cursor:'pointer'}}>Send</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
