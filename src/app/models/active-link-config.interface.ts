import { Playlist } from './playlist.interface';
import { ContentType } from '../enums/content-type.enum';
import { Album } from './album.interface';
import { Artist } from './artist.interface';

export interface ActiveLinkConfig {
  playlist?: Playlist;
  contentType: ContentType;
  album?: Album;
  artist?: Artist;
}
