import {Component, Input, OnInit} from '@angular/core';
import {BarConfig} from '../../../../../models/bar-config.interface';
import {PlaylistBarConfig} from '../../../../../models/playlist-bar-config.interface';

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.scss']
})
export class HorizontalBarComponent implements OnInit {

  @Input() config: PlaylistBarConfig;

  constructor() {
  }

  ngOnInit(): void {
  }

}
