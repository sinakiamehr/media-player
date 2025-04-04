import React from 'react';
import { Playlist, TimeFormatter } from '../types';

interface TrackListProps {
  currentPlaylist: Playlist;
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  formatTime: TimeFormatter;
}

/**
 * TrackList component for displaying and selecting tracks in the current playlist
 */
const TrackList: React.FC<TrackListProps> = ({ 
  currentPlaylist, 
  currentTrackIndex, 
  onSelectTrack, 
  formatTime 
}) => {
  return (
    <div className="playlist-tracks">
      <h3>{currentPlaylist.name} Tracks</h3>
      <ul>
        {/* Map through each track in the playlist and render as list items */}
        {currentPlaylist.tracks.map((track, index) => (
          <li 
            key={track.name}
            onClick={() => onSelectTrack(index)} // Select track when clicked
            className={currentTrackIndex === index ? 'active' : ''} // Highlight the currently playing track
          >
            {track.name} - {formatTime(track.duration)} {/* Display track name and formatted duration */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;