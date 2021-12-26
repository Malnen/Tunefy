import {Image} from './image.interface';

export interface PlaylistBarConfig {
  size: number;
  step: number;
  label: string;
  showImage?: boolean;
  image?: Image;
  index: number;
}
