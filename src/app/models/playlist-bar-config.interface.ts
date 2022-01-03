import { Image } from './image.interface';
import { Album } from './album.interface';
import { Artist } from './artist.interface';

export interface PlaylistBarConfig {
  size: number;
  step: number;
  label: string;
  showImage?: boolean;
  image?: Image;
  index: number;
  album?: Album;
  artist?: Artist;
  genreArtists?: Artist[];
}
