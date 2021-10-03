import { Item } from './item.interface';

export interface SearchResponseTracks {
  next: string;
  items: Item[];
}
