import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../../../../models/option.interface';

@Component({
  selector : 'app-option',
  templateUrl : './option.component.html',
  styleUrls : [ './option.component.scss' ]
})
export class OptionComponent implements OnInit {

  @Input() option: Option;

  @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.option.action();
    this.clicked.emit();
  }

}
