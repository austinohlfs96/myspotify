import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart component
import ListeningTimeChart from './ListeningTime';

const Dashboard = ({ accessToken }) => {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([])
  const [topGenresData, setTopGenresData] = useState(null); // New state for top genres data
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      navigate('/');
    } else {
      fetchUserData(accessToken);
      fetchTopArtists(accessToken);
      fetchTopTracks(accessToken);
      fetchRecentTracks(accessToken);
      // fetchConcerts(accessToken);
    }
  }, []);

  // Fetch user data
  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      console.log('User Profile Data:', data); 
    } catch (error) {
      console.error('Error fetching profile data:', error);
      navigate('/');
    }
  };

  // Fetch top artists
  const fetchTopArtists = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setTopArtists(data.items);
      console.log('artist', data)
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  };

  // Fetch top tracks
  const fetchTopTracks = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setTopTracks(data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  

  // Fetch recent tracks
  const fetchRecentTracks = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setRecentTracks(data.items);
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
    }
  };

  // Fetch top genres data
  const fetchTopGenresData = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const genres = data.items.flatMap(artist => artist.genres);
      const genreCounts = genres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
      const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]).slice(0, 5);
      setTopGenresData({
        labels: sortedGenres,
        datasets: [{
          data: sortedGenres.map(genre => genreCounts[genre]),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#3CB371'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#3CB371'],
        }],
      });
    } catch (error) {
      console.error('Error fetching top genres data:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTopGenresData(accessToken);
    }
  }, [accessToken]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {profile.display_name}</h1>
      <div className="bento-box">
        <div className="bento-item">
          <h2>Profile</h2>
          <img src={profile.images[1]?.url} alt="Profile" className="profile-image" />
          <p><strong>Display Name:</strong> {profile.display_name}</p>
          <p><strong>Country:</strong> {profile.country}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
        <div className="bento-item">
          <h2>Top 5 Artists</h2>
          <ul>
            {topArtists.map((artist) => (
              <li key={artist.id} onClick={() => setSelectedArtist(artist.id)}>{artist.name}</li>
            ))}
          </ul>
        </div>
        <div className="bento-item">
          <h2>Top 5 Songs</h2>
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>{track.name}</li>
            ))}
          </ul>
        </div>
        <div className="bento-item">
          <h2>Recent Tracks</h2>
          <ul>
            {recentTracks.map((track, index) => (
              <li key={index}>{track.track.name}</li>
            ))}
          </ul>
        </div>
        <div className="bento-item">
          <h2>Top Genres</h2>
          {topGenresData && <Pie data={topGenresData} />} {/* Rendering Pie chart */}
        </div>
        <ListeningTimeChart accessToken={accessToken} />
        {/* <Playlist artistId={selectedArtist}/> */}
      </div>
    </div>
  );
};

export default Dashboard;
