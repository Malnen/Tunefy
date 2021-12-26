import {Component, Input, OnInit} from '@angular/core';
import {PlaylistBarConfig} from '../../../../models/playlist-bar-config.interface';

@Component({
  selector: 'app-horizontal-chart',
  templateUrl: './horizontal-chart.component.html',
  styleUrls: ['./horizontal-chart.component.scss']
})
export class HorizontalChartComponent implements OnInit {

  @Input() bars: PlaylistBarConfig[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
