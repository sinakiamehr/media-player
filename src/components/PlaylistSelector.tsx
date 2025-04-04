import React from 'react';
import { Playlist } from '../types';

interface PlaylistSelectorProps {
  playlists: Playlist[];
  currentPlaylistIndex: number;
  onSelectPlaylist: (index: number) => void;
}

/**
 * PlaylistSelector component for displaying and selecting available playlists
 */
const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ 
  playlists, 
  currentPlaylistIndex, 
  onSelectPlaylist 
}) => {
  return (
    <div className="playlist-selector">
      <h2>Select Playlist</h2>
      <div className="playlist-buttons">
        {playlists.map((playlist, index) => (
          <button 
            key={playlist.name}
            onClick={() => onSelectPlaylist(index)}
            className={currentPlaylistIndex === index ? 'active' : ''}
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSelector;