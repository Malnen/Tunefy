import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Option } from '../../models/option.interface';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-context-menu',
  templateUrl : './context-menu.component.html',
  styleUrls : [ './context-menu.component.scss' ]
})
export class ContextMenuComponent extends HoverableComponent implements OnInit {

  @ViewChild('menu') menu: ElementRef;

  @Input() options: Option[];
  @Input() open: boolean;
  @Input() event: CustomMouseEvent;

  top: number;
  left: number;
  initialized: boolean;

  constructor(private _contextMenuService: ContextMenuService) {super(); }

  ngOnInit(): void {
    this.initialized = true;
    this.top = this.event.clientY;
    this.left = this.event.clientX;
  }

  onMaskClick(): void {
    this._contextMenuService.closeContextMenu();
  }

}
