import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Option } from '../../models/option.interface';
import { CustomMouseEvent } from '../../models/custom-mouse-event.interface';
import { HoverableComponent } from '../hoverable/hoverable.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';

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

  top: number;
  left: number;
  initialized: boolean;
  flipVertically: boolean;
  flipHorizontally: boolean;

  constructor(private _contextMenuService: ContextMenuService,
              private cdr: ChangeDetectorRef,
              private _elementRef: ElementRef) {super(); }

  ngOnInit(): void {
    this.initialized = true;
    this.top = this.event.clientY;
    this.left = this.event.clientX;
    this._contextMenuService.hasWidthUpdated().subscribe((width: number) => {
      this.flipVertically = this.event.clientX + width + 300 > window.innerWidth;
      if (this.flipVertically) {
        this.left = this.event.clientX - width;
        this.cdr.detectChanges();
      }
    });
    this._contextMenuService.hasHeightUpdated().subscribe((height: number) => {
      this.flipHorizontally = this.event.clientY + height > window.innerHeight;
      if (this.flipHorizontally) {
        this.top = this.event.clientY - height;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    const height = this.menu.nativeElement.getBoundingClientRect().height;
    this._contextMenuService.updateHeight(height);
    this.cdr.detectChanges();
  }

  onMaskClick(): void {
    this._contextMenuService.closeContextMenu();
  }

  onMaskContextClick(event: MouseEvent): void {
    this._contextMenuService.closeContextMenu();
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles : true,
      clientX : event.clientX,
      clientY : event.clientY
    });
    const element = document.elementsFromPoint(event.x, event.y)[ 1 ] as HTMLElement;
    element.dispatchEvent(contextMenuEvent);
  }

}
