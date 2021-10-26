import { Item } from './item.interface';

export interface PlaylistItem {
  added_at: string;
  track: Item;
  index: number;
}
