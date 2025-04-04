import React from 'react';
import { Track, Playlist, TimeFormatter } from '../types';

interface NowPlayingProps {
  currentTrack: Track;
  currentPlaylist: Playlist;
  currentTime: number;
  formatTime: TimeFormatter;
}

/**
 * NowPlaying component for displaying current track information and progress
 */
const NowPlaying: React.FC<NowPlayingProps> = ({ 
  currentTrack, 
  currentPlaylist, 
  currentTime, 
  formatTime 
}) => {
  return (
    <div className="now-playing">
      <h2>Now Playing</h2>
      <div className="track-info">
        <h3>{currentTrack.name}</h3>
        <p>Artist: {currentPlaylist['artist:']} - {currentPlaylist.year}</p>
        {/* Progress bar to show playback position */}
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
          >
            
          </div>
        </div>
        {/* Time display showing current position and total duration */}
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;