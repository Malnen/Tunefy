import { Component, OnInit } from '@angular/core';

@Component({
  selector : 'app-panel-wrapper',
  templateUrl : './panel-wrapper.component.html',
  styleUrls : [ './panel-wrapper.component.scss' ]
})
export class PanelWrapperComponent implements OnInit {

  topHeight: number;
  bottomHeight = 125;

  constructor() {
  }

  ngOnInit(): void {
    this.onResize();
  }

  onResize(): void {
    this.topHeight = window.innerHeight - this.bottomHeight;
  }

}
