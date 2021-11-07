import { Album } from './album.interface';

export interface ArtistsAlbumsResponse {
  href: string;
  items: Album[];
  next: string;
  limit: number;
  offset: number;
  total: number;
}
