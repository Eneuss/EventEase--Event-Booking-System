import { useState } from 'react';
import { login, logout } from '../api.js';

// Login form, or the logged-in user's name with a logout button.
// The session itself is restored by App on page load.
function Login({ loggedInUser, onLoginChange }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const { ok, data } = await login(username, password);
      if (ok && data.success) {
        onLoginChange(data.username);
        setUsername('');
        setPassword('');
        setError(null);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login request failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    onLoginChange(null);
  };

  return (
    <div className="login-box">
      {loggedInUser ? (
        <div>
          <p>Logged in as <strong>{loggedInUser}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Login;
