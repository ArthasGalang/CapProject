import React, { useState } from 'react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token/session
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: 420,
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#667eea',
            marginBottom: '0.5rem',
            letterSpacing: 1,
          }}>
            NegoGen T.
          </h1>
          <p style={{ color: '#888', fontSize: '1rem', fontWeight: 500 }}>Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              border: '1px solid #fca5a5',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: 600,
              color: '#333',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@negogent.com"
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontWeight: 600,
              color: '#333',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: loading ? '#9ca3af' : '#667eea',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#5568d3')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#667eea')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#888',
          fontSize: '0.85rem',
        }}>
          <p>Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
