import { Image } from './image.interface';
import { Artist } from './artist.interface';
import { ContentType } from '../enums/content-type.enum';
import { Album } from './album.interface';

export interface BarConfig {
  size?: number;
  caption?: string;
  image?: Image;
  height?: number;
  width?: number;
  navigable?: boolean;
  navigationLabel?: string;
  genreArtists?: Artist[];
  contentType?: ContentType;
  album?: Album;
  artist?: Artist;
}
