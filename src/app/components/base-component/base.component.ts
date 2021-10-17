import { Component, OnInit } from '@angular/core';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { Option } from '../../models/option.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';

@Component({
  selector : 'app-base-component',
  templateUrl : './base.component.html',
  styleUrls : [ './base.component.scss' ]
})
export class BaseComponent extends HoverableComponent implements OnInit {

  openContextMenu: boolean;
  mouseEvent: CustomMouseEvent;
  options = [];

  constructor() {super(); }

  ngOnInit(): void {
  }

  onContextMenu(event: MouseEvent): void {
    if (this.options.length > 0) {
      this.mouseEvent = event;
      this.openContextMenu = true;
    }
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
