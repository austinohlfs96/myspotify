import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spotifiy from './SpotifiyComponents';
import Dashboard from './DashBoard';

const CLIENT_ID = '6c9db96521d44aabbf0156467a180669'; // Replace with your Spotify app client ID
const SCOPES = 'user-read-private user-top-read user-read-recently-played playlist-modify-private';
const REDIRECT_URI = 'http://localhost:3003/';
const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=token&show_dialog=true`;

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
          // Store the access token for future use (e.g., localStorage)
          localStorage.setItem('spotify_access_token', accessToken);

          // Fetch user data (requires additional API call)
          const getUserData = async () => {
            const response = await fetch('https://api.spotify.com/v1/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const data = await response.json();
            setUser(data);
            console.log('data', data)
            localStorage.setItem('spotify_user_id', data.id);
          };
          getUserData();
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Login with Spotify</h1>
      {!accessToken && (
        <a href={LOGIN_URL}>
          <button>Login with Spotify</button>
        </a>
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
