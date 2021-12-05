import { Component, Input, OnInit } from '@angular/core';
import { BarConfig } from '../../../../../models/bar-config.interface';

@Component({
  selector : 'app-chart-hint',
  templateUrl : './chart-hint.component.html',
  styleUrls : [ './chart-hint.component.scss' ]
})
export class ChartHintComponent implements OnInit {

  @Input() config: BarConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
