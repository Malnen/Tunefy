import { Device } from './device.interface';
import { Item } from './item.interface';
import {RepeatState} from '../enums/repeat-state.enum';

export interface Player {
  device?: Device;
  shuffle_state?: boolean;
  repeat_state?: RepeatState;
  timestamp?: number;
  context?: any;
  progress_ms?: number;
  is_playing?: boolean;
  item?: Item;
}
