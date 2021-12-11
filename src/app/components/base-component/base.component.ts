import { Component, OnInit } from '@angular/core';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { Option } from '../../models/option.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ScreenSize } from '../../models/screen-size.interface';
import { ResizeService } from '../../services/resize-service/resize.service';

@Component({
  selector : 'app-base-component',
  templateUrl : './base.component.html',
  styleUrls : [ './base.component.scss' ]
})
export class BaseComponent extends HoverableComponent implements OnInit {

  openContextMenu: boolean;
  mouseEvent: CustomMouseEvent;
  options = [];
  mobile = false;
  size: ScreenSize;

  constructor(private _contextMenuService: ContextMenuService,
              private _resizeService: ResizeService) {super(); }

  ngOnInit(): void {
    this.size = this._resizeService.size;
    this.mobile = this.size.width < 1000;
    this._resizeService.hasSizeUpdated().subscribe((size: ScreenSize) => {
      this.size = size;
      this.mobile = this.size.width < 1000;
    });
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
