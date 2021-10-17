import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Option } from '../../models/option.interface';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';
import { element } from 'protractor';

@Component({
  selector : 'app-context-menu',
  templateUrl : './context-menu.component.html',
  styleUrls : [ './context-menu.component.scss' ]
})
export class ContextMenuComponent extends HoverableComponent implements OnInit, AfterViewInit {

  @ViewChild('menu') menu: ElementRef;

  @Input() options: Option[];
  @Input() open: boolean;
  @Input() event: CustomMouseEvent;

  @Output() maskClick = new EventEmitter<void>();
  @Output() maskContextClick = new EventEmitter<MouseEvent>();

  top: number;
  left: number;
  initialized: boolean;

  constructor() {super(); }

  ngOnInit(): void {
    this.initialized = true;
    this.top = this.event.clientY;
    this.left = this.event.clientX;
  }

  ngAfterViewInit(): void {
   // setTimeout(() => this.correctPosition(), 0);
  }

  onMaskClick(): void {
    this.maskClick.emit();
  }

  private correctPosition(): void {
    const offset = 30;
    const width = this.menu.nativeElement.offsetWidth;
    const isOutsideRightBorder = this.left + width > window.innerWidth;
    if (isOutsideRightBorder) {
      this.left -= width + offset;
    }
  }

}
