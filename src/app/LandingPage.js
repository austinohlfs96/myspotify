// LandingPage.js
import React from 'react';
import Spotifiy from './SpotifiyComponents';
import Login from './Login'; // Assuming a separate Login component


const LandingPage = () => {
  // Check if a user is logged in (e.g., by checking stored access token)
  const isLoggedIn = localStorage.getItem('spotify_access_token'); // Adjust based on your storage strategy

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1>My Spotify</h1>
      {isLoggedIn ? (
         <Login  /> // Pass access token if logged in
      ) : (
        <Login /> // Render login component if not logged in
      )}
    
    </div>
  );
};

export default LandingPage;