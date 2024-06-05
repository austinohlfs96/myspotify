import React from 'react';

const Playlist = ({ artistId }) => {

  const iframeStyle = {
    display: artistId ? "flex" : "none",
    minHeight: '360px',
  };

  return (
    <iframe
      title="Spotify Embed: Recommendation Playlist"
      src={`https://open.spotify.com/embed/artist/${artistId}`}
      width="100%"
      height="100%"
      style={iframeStyle}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
};

export default Playlist;
