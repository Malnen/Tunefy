import { Artist } from './artist.interface';
import { Image } from './image.interface';
import { PlaylistTracks } from './playlist-tracks.interface';

export interface Album {
  artists: Artist[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  total_tracks: number;
  uri: string;
}
