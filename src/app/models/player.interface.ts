import { Device } from './device.interface';
import { Item } from './item.interface';

export interface Player {
  device?: Device;
  shuffle_state?: boolean;
  repeat_state?: ReadyState;
  timestamp?: number;
  context?: any;
  progress_ms?: number;
  is_playing?: boolean;
  item?: Item;
}