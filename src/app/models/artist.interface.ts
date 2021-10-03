import { Image } from './image.interface';
import { Followers } from './followers.interface';

export interface Artist {
  href: string;
  id: string;
  name: string;
  type: string;
  followers: Followers;
  images: Image[];
  genres: string[];
}
