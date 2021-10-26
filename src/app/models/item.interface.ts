import { Artist } from './artist.interface';
import { Album } from './album.interface';

export interface Item {
  album: Album;
  artists: Artist[];
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  track_number: number;
  type: string;
  uri: string;
  followed: boolean;
  available_markets: string[];
  disabled: boolean;
  restrictions: any;
}
