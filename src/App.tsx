import { useState, useRef, useEffect } from 'react';
import playlists from './data/playlists.json';
import PlaylistSelector from './components/PlaylistSelector';
import NowPlaying from './components/NowPlaying';
import Controls from './components/Controls';
import TrackList from './components/TrackList';
import { TimeFormatter } from './types';

/**
 * Main App component for the media player application
 * Handles playlist selection, track playback, and UI rendering
 */
function App() {
  // State variables for tracking playback status
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0); // Index of the currently selected playlist
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);      // Index of the currently playing track
  const [isPlaying, setIsPlaying] = useState(false);                  // Whether audio is currently playing
  const [currentTime, setCurrentTime] = useState(0);                  // Current playback position in seconds
  
  // Reference to the audio element for controlling playback
  const audioRef = useRef(new Audio());
  
  // Derived values from the current state
  const currentPlaylist = playlists.playlists[currentPlaylistIndex]; // Currently selected playlist
  const currentTrack = currentPlaylist.tracks[currentTrackIndex];    // Currently selected track

  /**
   * Effect hook to handle track changes and playback
   * Updates the audio source when track or playlist changes
   * Sets up event listener for tracking playback time
   */
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = currentTrack.url; // Set the audio source to the current track URL
    
    if (isPlaying) {
      audio.play(); // Auto-play when track changes if player was already playing
    }

    // Update the current time state as the audio plays
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    
    // Cleanup function to remove event listener when component unmounts or dependencies change
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [currentTrackIndex, currentPlaylistIndex]);

  /**
   * Effect hook to handle track completion
   * Sets up event listener for when a track finishes playing
   * Automatically advances to the next track or stops playback at the end of playlist
   */
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1); // Move to next track if available
      } else {
        setIsPlaying(false); // Stop playback if at the end of playlist
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, currentPlaylist.tracks.length]);

/**
 * Toggles play/pause state of the audio player
 * Pauses if currently playing, plays if currently paused
 */
const togglePlay = () => {
  if (isPlaying) {
    audioRef.current.pause(); // Pause the audio if currently playing
  } else {
    audioRef.current.play();  // Play the audio if currently paused
  }
  setIsPlaying(!isPlaying);  // Toggle the playing state
};

/**
 * Advances to the next track in the playlist
 * Loops back to the first track if at the end of the playlist
 */
const playNextTrack = () => {
  if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
    setCurrentTrackIndex(currentTrackIndex + 1); // Move to next track
  } else {
    setCurrentTrackIndex(0); // Loop back to first track if at the end
  }
  setIsPlaying(true); // Start playing the new track
};

/**
 * Goes to the previous track in the playlist
 * Loops to the last track if at the beginning of the playlist
 */
const playPreviousTrack = () => {
  if (currentTrackIndex > 0) {
    setCurrentTrackIndex(currentTrackIndex - 1); // Move to previous track
  } else {
    setCurrentTrackIndex(currentPlaylist.tracks.length - 1); // Loop to last track if at the beginning
  }
  setIsPlaying(true); // Start playing the new track
};

/**
 * Formats time in seconds to a string in the format 'mm:ss'
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string **/
const formatTime: TimeFormatter = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Handles playlist selection
 * @param {number} index - Index of the playlist to select
 */
const selectPlaylist = (index: number) => {
  setCurrentPlaylistIndex(index); // Update the current playlist
  setCurrentTrackIndex(0);        // Reset to the first track
  setIsPlaying(false);            // Stop playback when changing playlists
};

/**
 * Handles track selection within the current playlist
 * @param {number} index - Index of the track to select
 */
const selectTrack = (index: number) => {
  setCurrentTrackIndex(index); // Update the current track
  setIsPlaying(true);          // Start playing the selected track
};

return (
  // Main container for the media player application
  <div className="media-player">
    {/* Playlist selection component */}
    <PlaylistSelector 
      playlists={playlists.playlists}
      currentPlaylistIndex={currentPlaylistIndex}
      onSelectPlaylist={selectPlaylist}
    />

    {/* Now playing component */}
    <NowPlaying 
      currentTrack={currentTrack}
      currentPlaylist={currentPlaylist}
      currentTime={currentTime}
      formatTime={formatTime}
    />

    {/* Playback controls component */}
    <Controls 
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      onPlayNext={playNextTrack}
      onPlayPrevious={playPreviousTrack}
    />

    {/* Track list component */}
    <TrackList 
      currentPlaylist={currentPlaylist}
      currentTrackIndex={currentTrackIndex}
      onSelectTrack={selectTrack}
      formatTime={formatTime}
    />
  </div>
);

}

export default App;
