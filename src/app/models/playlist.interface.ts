import { Image } from './image.interface';

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
}
