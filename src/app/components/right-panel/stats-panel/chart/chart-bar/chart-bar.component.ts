import { Component, Input, OnInit } from '@angular/core';
import { BarConfig } from '../../../../../models/bar-config.interface';
import { HoverableComponent } from '../../../../hoverable/hoverable.component';

@Component({
  selector : 'app-chart-bar',
  templateUrl : './chart-bar.component.html',
  styleUrls : [ './chart-bar.component.scss' ]
})
export class ChartBarComponent extends HoverableComponent implements OnInit {

  @Input() config: BarConfig;

  constructor() {super(); }

  ngOnInit(): void {
  }

}
