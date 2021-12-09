import { Image } from './image.interface';
import { Owner } from './owner.interface';

export interface Playlist {
  id: string;
  href: string;
  name: string;
  images: Image[];
  uri: string;
  tracks: {
    total: number;
    href: string;
  };
  owner: Owner;
}
