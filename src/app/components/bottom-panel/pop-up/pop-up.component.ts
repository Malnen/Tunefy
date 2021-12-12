import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PopUpContentType } from '../../../enums/pop-up-content-type.enum';
import { ResizeService } from '../../../services/resize-service/resize.service';
import { ScreenSize } from '../../../models/screen-size.interface';

@Component({
  selector : 'app-pop-up',
  templateUrl : './pop-up.component.html',
  styleUrls : [ './pop-up.component.scss' ]
})
export class PopUpComponent implements OnInit {

  @ViewChild('popUp') popUp: ElementRef;

  @Input() icon: string;
  @Input() fontSet: string;
  @Input() iconClass: string;
  @Input() popUpContentType: PopUpContentType;

  popUpContentTypeEnum = PopUpContentType;
  popUpOpen: boolean;
  popUpHover: boolean;
  popUpShow: boolean;
  opacity = 0;
  marginTop: number;
  marginLeft: number;

  private _size: ScreenSize;

  constructor(private _resizeService: ResizeService,
              private _elRef: ElementRef) { }

  ngOnInit(): void {
  }

  togglePopUp(): void {
    this.popUpOpen = !this.popUpOpen;
    if (this.popUpOpen) {
      this.popUpShow = true;
      this.marginTop = -170;
      setTimeout(() => this.opacity = 1, 10);
    } else {
      this.opacity = 0;
      setTimeout(() => this.popUpShow = false, 250);
    }
  }

  onPopUpMouseOver(): void {
    this.popUpHover = true;
  }

  onPopUpMouseLeave(): void {
    this.popUpHover = false;
  }

  onLoaded(): void {
    setTimeout(() => {
      const height = this.popUp.nativeElement.offsetHeight;
      const offset = 50;
      this.marginTop = -(height + offset);
      this._size = this._resizeService.size;
      this.setLeft();
      this._resizeService.hasSizeUpdated().subscribe((size: ScreenSize) => {
        this._size = size;
        this.setLeft();
      });
    }, 0);
  }

  private setLeft(): void {
    if (this._size.width < 1001) {
      const popupWidth = this.popUp?.nativeElement.getBoundingClientRect().width;
      const x = this.popUp.nativeElement.getBoundingClientRect().x;
      const buttonX = this._elRef.nativeElement.getBoundingClientRect().x;
      const center = this._size.width / 2;
      const offset = center - buttonX - popupWidth / 2;
      this.marginLeft = offset;
      this.popUp.nativeElement.style.marginLeft = this.marginLeft + 'px';
    } else {
      const popupWidth = this.popUp.nativeElement.getBoundingClientRect().width;
      const width = this._elRef.nativeElement.getBoundingClientRect().width;
      this.popUp.nativeElement.style.marginLeft = -popupWidth / 2 + width / 2 + 'px';
    }
  }

}
