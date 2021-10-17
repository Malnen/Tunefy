import { Item } from './item.interface';

export interface RecentlyPlayedItem {
  track: Item;
  played_at: string;
}
