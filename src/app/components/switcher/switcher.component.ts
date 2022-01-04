import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Switch} from '../../models/switch.interface';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss']
})
export class SwitcherComponent implements OnInit, OnChanges {

  @Input() switches: Switch[];
  @Input() defaultValue: any;

  @Output() switched = new EventEmitter<Switch>();

  currentValue: any;

  constructor() {
  }

  ngOnInit(): void {
    this.currentValue = this.defaultValue;
  }

  ngOnChanges(): void {
    this.currentValue = this.defaultValue;
  }

  switch(switcher: Switch): void {
    this.currentValue = switcher.value;
    this.switched.emit(switcher);
  }

}
