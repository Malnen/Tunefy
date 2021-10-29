import { Album } from './album.interface';
import { AlbumTracks } from './album-tracks.interface';

export interface AlbumResponse extends Album {
  href: string;
  tracks?: AlbumTracks;
  next: string;
  total: number;
}
