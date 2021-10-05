import { Album } from './album.interface';

export interface SearchResponseAlbum {
  next: string;
  items: Album[];
}
