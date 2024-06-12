// ListeningTimeChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Importing Pie chart component
import Chart from 'chart.js/auto';

const fetchRecentlyPlayedTracks = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log('Listening Data', data)
    return data.items;
    
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return [];
  }
};

const categorizeListeningTimes = (tracks) => {
  const categories = {
    morning: 0,  // 6am - 12pm
    afternoon: 0, // 12pm - 6pm
    evening: 0, // 6pm - 12am
    night: 0, // 12am - 6am
  };

  tracks.forEach((track) => {
    const playedAt = new Date(track.played_at);
    const hour = playedAt.getHours();
    const durationHours = track.track.duration_ms / 3600000;

    if (hour >= 6 && hour < 12) {
      categories.morning += durationHours;
    } else if (hour >= 12 && hour < 18) {
      categories.afternoon += durationHours;
    } else if (hour >= 18 && hour < 24) {
      categories.evening += durationHours;
    } else {
      categories.night += durationHours;
    }
  });

  return categories;
};

const ListeningTimeChart = ({ accessToken }) => {
  const [listeningCategories, setListeningCategories] = useState(null);

  useEffect(() => {
    const fetchListeningTime = async () => {
      try {
        const recentlyPlayedTracks = await fetchRecentlyPlayedTracks(accessToken);
        const categorizedData = categorizeListeningTimes(recentlyPlayedTracks);
        setListeningCategories(categorizedData);
      } catch (error) {
        console.error('Error calculating listening time:', error);
      }
    };

    if (accessToken) {
      fetchListeningTime();
    }
  }, [accessToken]);

  const pieData = listeningCategories
    ? {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [
          {
            data: [
              listeningCategories.morning,
              listeningCategories.afternoon,
              listeningCategories.evening,
              listeningCategories.night,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2'],
          },
        ],
      }
    : null;

  return (
    <div className="bento-item">
      <h2>Listening Time (Last Week)</h2>
      {pieData ? <Pie data={pieData} /> : <p>Loading...</p>}
    </div>
  );
};

export default ListeningTimeChart;
