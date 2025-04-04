/**
 * Type definitions for the media player application
 */

export interface Track {
  name: string;
  url: string;
  duration: number;
}

export interface Playlist {
  name: string;
  'artist:': string;
  year: number;
  tracks: Track[];
}

// Common utility type for formatting time
export type TimeFormatter = (seconds: number) => string;