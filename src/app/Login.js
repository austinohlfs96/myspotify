import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Spotifiy from './SpotifiyComponents';
import Dashboard from './DashBoard';

const CLIENT_ID = '6c9db96521d44aabbf0156467a180669'; // Replace with your Spotify app client ID
const SCOPES = 'user-read-private user-top-read user-read-recently-played playlist-modify-private user-read-playback-state user-modify-playback-state streaming';
const REDIRCT_URI = 'https://myspotify-xq17.onrender.com/';
const devREDIRCT_URI = 'http://localhost:3003/';
const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRCT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=token&show_dialog=true`;



const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1DB954;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
`;

const LoginButton = styled.a`
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1ed760;
  }
`;

const UserMessage = styled.p`
  font-size: 20px;
  margin-top: 20px;
`;

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
    <LoginContainer style={{display: 'block'}}>
      <Title>Login with Spotify</Title>
      {!accessToken && (
        <LoginButton href={LOGIN_URL}>
          Login with Spotify
        </LoginButton>
      )}
      {accessToken && user && (
        <div>
          <UserMessage>You are logged in as {user.display_name}!</UserMessage>
          <Dashboard accessToken={accessToken} />
          <Spotifiy accessToken={accessToken} />
        </div>
      )}
    </LoginContainer>
  );
};

export default Login;
