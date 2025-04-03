import { useState, useRef, useEffect } from 'react';
import playlists from './data/playlists.json';

function App() {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef(new Audio());
  const currentPlaylist = playlists.playlists[currentPlaylistIndex];
  const currentTrack = currentPlaylist.tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = currentTrack.url;
    
    if (isPlaying) {
      audio.play();
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [currentTrackIndex, currentPlaylistIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, currentPlaylist.tracks.length]);

const togglePlay = () => {
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};

const playNextTrack = () => {
  if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
    setCurrentTrackIndex(currentTrackIndex + 1);
  } else {
    setCurrentTrackIndex(0);
  }
  setIsPlaying(true);
};

const playPreviousTrack = () => {
  if (currentTrackIndex > 0) {
    setCurrentTrackIndex(currentTrackIndex - 1);
  } else {
    setCurrentTrackIndex(currentPlaylist.tracks.length - 1);
  }
  setIsPlaying(true);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const selectPlaylist = (index) => {
  setCurrentPlaylistIndex(index);
  setCurrentTrackIndex(0);
  setIsPlaying(false);
};

const selectTrack = (index) => {
  setCurrentTrackIndex(index);
  setIsPlaying(true);
};

return (
  <div className="media-player">
    <div className="playlist-selector">
      <h2>Select Playlist</h2>
      <div className="playlist-buttons">
        {playlists.playlists.map((playlist, index) => (
          <button 
            key={playlist.name}
            onClick={() => selectPlaylist(index)}
            className={currentPlaylistIndex === index ? 'active' : ''}
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>

    <div className="now-playing">
      <h2>Now Playing</h2>
      <div className="track-info">
        <h3>{currentTrack.name}</h3>
        <p>{currentPlaylist['artist:']} • {currentPlaylist.year}</p>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
          />
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>
    </div>

    <div className="controls">
      <button onClick={playPreviousTrack}>Previous</button>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={playNextTrack}>Next</button>
    </div>

    <div className="playlist-tracks">
      <h3>{currentPlaylist.name} Tracks</h3>
      <ul>
        {currentPlaylist.tracks.map((track, index) => (
          <li 
            key={track.name}
            onClick={() => selectTrack(index)}
            className={currentTrackIndex === index ? 'active' : ''}
          >
            {track.name} - {formatTime(track.duration)}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

}

export default App;
