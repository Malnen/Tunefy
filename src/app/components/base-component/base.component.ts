import { Component, OnInit } from '@angular/core';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { Option } from '../../models/option.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-base-component',
  templateUrl : './base.component.html',
  styleUrls : [ './base.component.scss' ]
})
export class BaseComponent extends HoverableComponent implements OnInit {

  openContextMenu: boolean;
  mouseEvent: CustomMouseEvent;
  options = [];

  constructor(private _contextMenuService: ContextMenuService) {super(); }

  ngOnInit(): void {
  }

  onContextMenu(event: MouseEvent): void {
    if (this.options.length > 0) {
      this.mouseEvent = event;
      this.openContextMenu = true;
      this._contextMenuService.updateOptions(this.options);
    }
  }

  onContextMenuClickedOutside(): void {
    this.openContextMenu = false;
  }

}
