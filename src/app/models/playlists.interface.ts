import { Playlist } from './playlist.interface';

export interface Playlists {
  next: string;
  total: number;
  items: Playlist[];
  limit: number;
}
