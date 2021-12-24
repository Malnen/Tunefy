import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-aufio-feature-bar',
  templateUrl: './aufio-feature-bar.component.html',
  styleUrls: ['./aufio-feature-bar.component.scss']
})
export class AufioFeatureBarComponent implements OnInit, OnChanges {

  @Input() value: number;
  @Input() label: string;

  valueToDisplay = 0;
  roundedValue = 0;
  expanded = false;

  constructor() {
  }

  ngOnInit(): void {
    this.prepareData();
  }

  ngOnChanges(): void {
    this.prepareData();
  }

  onExpandClick(): void {
    this.expanded = !this.expanded;
  }

  private prepareData(): void {
    this.roundedValue = Math.round(this.value * 100) / 100;
    setTimeout(() => this.valueToDisplay = this.value, 0);
  }

}
