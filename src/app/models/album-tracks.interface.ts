import { Item } from './item.interface';

export interface AlbumTracks {
  href: string;
  items?: Item[];
  next: string;
  total: number;
}
