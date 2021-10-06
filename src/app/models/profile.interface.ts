import { Image } from './image.interface';

export interface Profile {
  display_name: string;
  images: Image[];
  product: string;
}