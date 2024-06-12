import React, { useState, useEffect } from 'react';
const token = localStorage.getItem('spotify_access_token');


async function fetchWebApi(endpoint, method, body) {
  
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
  }

  return await res.json();
}

const PlaylistGenerator = () => {
  const [playlist, setPlaylist] = useState([]);
  const [danceability, setDanceability] = useState(0.5);
  const [energy, setEnergy] = useState(0.5);
  const [popularity, setPopularity] = useState(50);
  const [includeLive, setIncludeLive] = useState(false);
  const [availableGenres, setAvailableGenres] = useState(["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", 'live', "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]);
  const [selectedGenre, setSelectedGenre] = useState('rock');
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [tracks, setTracks] = useState('5')
  
  
  
  async function getRandomTracks(seedGenres = [], targetDanceability = null, targetEnergy = null, targetPopularity = null, includeLive = false) {
    const params = new URLSearchParams();
    if (seedGenres.length > 0) {
      params.append('seed_genres', seedGenres.join(','));
    }
    if (targetDanceability !== null) {
      params.append('target_danceability', targetDanceability);
    }
    if (targetEnergy !== null) {
      params.append('target_energy', targetEnergy);
    }
    if (targetPopularity !== null) {
      params.append('target_popularity', targetPopularity);
    }
    if (includeLive !== false) {
      params.append('include', 'live');
    }
    params.append('limit', tracks);
    const response = await fetchWebApi(`v1/recommendations?${params.toString()}`, 'GET');
    return response.tracks;
  }
  
  async function fetchDevices(accessToken) {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      const data = await response.json();
      setDeviceId(data.devices[0].id)
      return data.devices;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return null;
    }
  }
  fetchDevices();
  

  useEffect(() => {
    // Load Spotify Web Playback SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Spotify player when SDK is ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: callback => {
          // Fetch access token from wherever you store it (e.g., localStorage)
          const accessToken = localStorage.getItem('spotify_access_token');
          callback(accessToken);
        },
        volume: 0.5
      });
      

      // Add listener for 'ready' event
      player.addListener('ready', ({ deviceId }) => {
       // Log the device ID
        ; // Store the device ID in state
      });

      // Connect to the Spotify player
      player.connect().then(success => {
        if (success) {
          console.log('Successfully connected to Spotify player');
        } else {
          console.error('Failed to connect to Spotify player');
        }
      });

      // Save player object if needed
      // setPlayer(player);
    };
  }, []);

  const fetchRandomTracks = async () => {
    try {
      const tracks = await getRandomTracks([selectedGenre], danceability, energy, popularity, includeLive);
      console.log('Fetched tracks:', tracks);
      setPlaylist(tracks);
    } catch (error) {
      console.error('Error fetching random tracks:', error);
      setPlaylist([]);
    }
  };

  const playTrack = (uri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
      },
    });
  };

  return (
    <div className="playlist-container">
      <h1 className="playlist-header">Random Playlist</h1>
      <div>
        <label htmlFor="genre-select">Genre:</label>
        <select id="genre-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {availableGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tracks"># of Tracks:</label>
        <input
          type="range"
          id="tracks"
          min="0"
          max="50"
          step="1"
          value={tracks}
          onChange={(e) => setTracks(e.target.value)}
        />
        <span>{tracks}</span>
      </div>
      <div>
        <label htmlFor="danceability">Danceability:</label>
        <input
          type="range"
          id="danceability"
          min="0"
          max="1"
          step="0.01"
          value={danceability}
          onChange={(e) => setDanceability(e.target.value)}
        />
        <span>{danceability}</span>
      </div>
      <div>
        <label htmlFor="energy">Energy:</label>
        <input
          type="range"
          id="energy"
          min="0"
          max="1"
          step="0.01"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />
        <span>{energy}</span>
      </div>
      <div>
        <label htmlFor="popularity">Popularity:</label>
        <input
          type="range"
          id="popularity"
          min="0"
          max="100"
          step="1"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
        />
        <span>{popularity}</span>
      </div>
      {/* <div>
        <label htmlFor="include-live">Include Live Songs:</label>
        <input
          type="checkbox"
          id="include-live"
          checked={includeLive}
          onChange={(e) => setIncludeLive(e.target.checked)}
        />
      </div> */}
      <button onClick={fetchRandomTracks} className="search-button">Search</button>
      <ul className="track-list">
        {playlist && playlist.length > 0 ? (
          playlist.map((track, index) => (
            <li key={index} className="track-item">
              <img src={track.album.images[0].url} alt={track.album.name} className="album-cover" />
              <div className="track-details">
                <p className="track-name">{track.name}</p>
                <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
                <button onClick={() => playTrack(track.uri)} className="listen-now">Listen Now</button>
              </div>
            </li>
          ))
        ) : (
          <p>No tracks available.</p>
        )}
      </ul>
    </div>
  );
};

export default PlaylistGenerator;
