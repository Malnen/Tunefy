import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../../models/option.interface';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';

@Component({
  selector : 'app-context-menu',
  templateUrl : './context-menu.component.html',
  styleUrls : [ './context-menu.component.scss' ]
})
export class ContextMenuComponent implements OnInit {

  @Input() options: Option[];
  @Input() open: boolean;
  @Input() event: CustomMouseEvent;

  @Output() maskClick = new EventEmitter<void>();
  @Output() maskContextClick = new EventEmitter<MouseEvent>();

  hover: boolean;
  top: number;
  left: number;
  initialized: boolean;

  constructor() { }

  ngOnInit(): void {
    this.initialized = true;
    this.top = this.event.clientY;
    this.left = this.event.clientX;
  }

  onMaskClick(): void {
    this.maskClick.emit();
  }

  onMaskContextMenu(event: MouseEvent): void {
    this.maskContextClick.emit(event);
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

}
