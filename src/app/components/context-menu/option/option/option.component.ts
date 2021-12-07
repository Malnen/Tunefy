import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Option } from '../../../../models/option.interface';
import { CustomMouseEvent } from '../../../../models/custom-mouse-event.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-option',
  templateUrl : './option.component.html',
  styleUrls : [ './option.component.scss' ]
})
export class OptionComponent implements OnInit, AfterViewInit {

  @ViewChild('subMenu') subMenu: ElementRef;

  @Input() option: Option;
  @Input() event: CustomMouseEvent;

  @Output() clicked = new EventEmitter<void>();

  left: number;
  top: number;
  showSubMenu = false;

  constructor(private _elementRef: ElementRef,
              private cdr: ChangeDetectorRef,
              private _contextMenuService: ContextMenuService) { }

  ngOnInit(): void {
    this._contextMenuService.hasWidthUpdated().subscribe((width: number) => {
      this.left = width;
    });
  }

  ngAfterViewInit(): void {
    const width = this._elementRef.nativeElement.getBoundingClientRect().width;
    this._contextMenuService.updateWidth(width);
    this.top = this._elementRef.nativeElement.getBoundingClientRect().top - this.event.clientY;
    this.cdr.detectChanges();
  }

  onClick(): void {
    this.option.action();
    this.clicked.emit();
  }

  onSubOptionClick(option: Option): void {
    option.action();
    this.clicked.emit();
  }

  onMouseEnter(): void {
    this.showSubMenu = true;
  }

  onMouseLeave(): void {
    this.showSubMenu = false;
  }

}
