import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BarConfig} from '../../../../../models/bar-config.interface';
import {PlaylistBarConfig} from '../../../../../models/playlist-bar-config.interface';

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.scss']
})
export class HorizontalBarComponent implements OnInit, OnChanges {

  @Input() config: PlaylistBarConfig;

  valueToDisplay = 0;

  private _value = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.setValue();
    this.setValueToDisplay();
  }

  ngOnChanges(): void {
    this.setValue();
    this.setValueToDisplay();
  }

  private setValue(): void {
    this._value = this.config.size * this.config.step;
  }

  private setValueToDisplay(): void {
    this.valueToDisplay = this._value;
  }

}
