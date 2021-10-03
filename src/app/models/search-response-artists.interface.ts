import { Artist } from './artist.interface';

export interface SearchResponseArtists {
  next: string;
  items: Artist[];
}
