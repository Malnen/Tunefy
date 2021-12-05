import { RecentlyPlayedItem } from './recently-played-item.interface';

export interface RecentlyPlayed {
  items: RecentlyPlayedItem[];
  next: string;
  limit: number;
}