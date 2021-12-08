import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import { Option } from '../../../models/option.interface';

@Component({
  selector : 'app-sub-menu',
  templateUrl : './sub-menu.component.html',
  styleUrls : [ './sub-menu.component.scss' ]
})
export class SubMenuComponent implements OnInit, AfterViewInit {

  @ViewChild('subMenu') submenu: ElementRef;

  @Input() left: number;
  @Input() subOptions: Option[];
  @Input() height = 0;

  @Output() subOptionClicked = new EventEmitter<Option>();

  top = 0;

  constructor(private cdr: ChangeDetectorRef,
              private _elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const height = this.submenu.nativeElement.getBoundingClientRect().height;
    const y = this.submenu.nativeElement.getBoundingClientRect().y;
    const flipHorizontally = y + height > window.innerHeight;
    if (flipHorizontally) {
      this.top = this.height - height;
    }
    
    this.cdr.detectChanges();
  }

  onSubOptionClick(option: Option): void {
    this.subOptionClicked.emit(option);
  }
}
