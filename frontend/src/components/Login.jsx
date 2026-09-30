import React, { useState, useEffect } from 'react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);

  //check login state while reloading the page
  useEffect(() => {
    fetch('/user/session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedInUser(data.username);
          onLoginSuccess(data.username);
        }
      });
  }, []);

  //enables the login to work
  const handleLogin = async () => {
    try {
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLoggedInUser(username);
        onLoginSuccess(username);
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

  //used to process the logout of the user
  const handleLogout = async () => {
    await fetch('/user/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setLoggedInUser(null);
    onLoginSuccess(null);
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
