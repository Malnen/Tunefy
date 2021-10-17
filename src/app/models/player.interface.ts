import { Device } from './device.interface';
import { Item } from './item.interface';
import {RepeatState} from '../enums/repeat-state.enum';
import { Context } from './context.interface';

export interface Player {
  device?: Device;
  shuffle_state?: boolean;
  repeat_state?: RepeatState;
  timestamp?: number;
  context?: Context;
  progress_ms?: number;
  is_playing?: boolean;
  item?: Item;
}
