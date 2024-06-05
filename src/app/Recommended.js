import React, { useState, useEffect } from 'react';

async function fetchWebApi(endpoint, method, body) {
  const token = localStorage.getItem('spotify_access_token');
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  console.log(endpoint, 'endpoint')
  return await res.json();
  
}

async function getAvailableGenres() {
  // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
  const response = await fetchWebApi('v1/recommendations/available-genre-seeds', 'GET');
  return response.genres;
}

const topTracksIds = [
  '4eDJSqXMxGTpzYK6QrlVfc', '79HrQJU7YPbROxUjzK5x1z', '22VHOlVYBqytsrAqV8yXBK'
];

async function getRecommendations(genre) {
  // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  let url = `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`;
  console.log(url, "url")
  if (genre) {
    url += `&seed_genres=${genre}`;
  }
  return (await fetchWebApi(url, 'GET')).tracks;
}

const Recommendations = () => {
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);

  useEffect(() => {
    fetchAvailableGenres();
  }, []);

  const fetchAvailableGenres = async () => {
    try {
      const genres = await getAvailableGenres();
      setAvailableGenres(genres);
    } catch (error) {
      console.error('Error fetching available genres:', error);
    }
  };

  useEffect(() => {
    fetchRecommendedTracks();
  }, [selectedGenre]);

  const fetchRecommendedTracks = async () => {
    try {
      const tracks = await getRecommendations(selectedGenre);
      setRecommendedTracks(tracks);
    } catch (error) {
      console.error('Error fetching recommended tracks:', error);
    }
  };

  const handleShuffle = () => {
    fetchRecommendedTracks();
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div className="recommendations-container">
      <h1 className="recommendations-header">Recommended Tracks</h1>
      <div>
        <label htmlFor="genre-select">Select Genre:</label>
        <select id="genre-select" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {availableGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <button className="shuffle-button" onClick={handleShuffle}>Shuffle</button>
      <ul className="track-list">
      {recommendedTracks && recommendedTracks.map(track => (
        <li key={track.id} className="track-item">
          <img src={track.album.images[0].url} alt={track.album.name} className="album-cover" />
          <div className="track-details">
            <p className="track-name">{track.name}</p>
            <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="listen-now">Listen Now</a>
          </div>
        </li>
      ))}
    </ul>

    </div>
  );
};

export default Recommendations;
