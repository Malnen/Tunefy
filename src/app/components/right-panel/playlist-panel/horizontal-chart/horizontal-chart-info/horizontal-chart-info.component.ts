import {Component, Input, OnInit} from '@angular/core';
import {ContentType} from '../../../../../enums/content-type.enum';

@Component({
  selector: 'app-horizontal-chart-info',
  templateUrl: './horizontal-chart-info.component.html',
  styleUrls: ['./horizontal-chart-info.component.scss']
})
export class HorizontalChartInfoComponent implements OnInit {

  @Input() contentType: ContentType;

  contentTypeEnum = ContentType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
