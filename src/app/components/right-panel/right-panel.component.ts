import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base.component';

@Component({
  selector : 'app-right-panel',
  templateUrl : './right-panel.component.html',
  styleUrls : [ './right-panel.component.scss' ]
})
export class RightPanelComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
