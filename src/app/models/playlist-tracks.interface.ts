import { PlaylistItem } from './playlist-item.interface';

export interface PlaylistTracks {
  href: string;
  items?: PlaylistItem[];
  next: string;
  total: number;
}
