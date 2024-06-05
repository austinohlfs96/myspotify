import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotifiy from './SpotifiyComponents';
import Dashboard from './DashBoard';

const CLIENT_ID = '6c9db96521d44aabbf0156467a180669'; // Replace with your Spotify app client ID
const SCOPES = 'user-read-private user-top-read user-read-recently-played playlist-modify-private';
const REDIRECT_BASE_URI = 'https://myspotify-xq17.onrender.com';
const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&response_type=token&show_dialog=true`;

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          setAccessToken(accessToken);

          // Fetch user data and store it securely
          fetchUserData(accessToken);
        }
      }
    };

    handleCallback();
  }, []);

  const fetchUserData = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setUser(data);
    // Store user data securely on the server side (e.g., in a database)
    console.log('User data:', data);
  };

  const handleLogin = () => {
    // Dynamically generate a unique redirect URI for each user
    const redirectUri = `${REDIRECT_BASE_URI}/callback/${encodeURIComponent(user.id)}`;
    window.location.href = `${LOGIN_URL}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Login with Spotify</h1>
      {!accessToken && (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
      {accessToken && user && (
        <>
          <p>You are logged in as {user.display_name}!</p>
          <Dashboard accessToken={accessToken} />
          <Spotifiy accessToken={accessToken} />
        </>
      )}
    </div>
  );
};

export default Login;
