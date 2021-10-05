import { Component, OnInit } from '@angular/core';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { Option } from '../../models/option.interface';

@Component({
  selector : 'app-base-component',
  templateUrl : './base.component.html',
  styleUrls : [ './base.component.scss' ]
})
export class BaseComponent implements OnInit {

  openContextMenu: boolean;
  mouseEvent: CustomMouseEvent;
  options = [];

  constructor() { }

  ngOnInit(): void {
  }

  onContextMenu(event: MouseEvent): void {
    this.mouseEvent = event;
    this.openContextMenu = true;
  }

  onContextMenuClickedOutside(): void {
    this.openContextMenu = false;
  }

  onContextMenuClickInside(event: MouseEvent): void {
    this.openContextMenu = false;
    const customEvent = event as CustomMouseEvent;
    customEvent.maskContextMenuClicked = true;
    setTimeout(() => this.onContextMenu(customEvent), 0);
  }

}
