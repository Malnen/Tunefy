import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PopUpContentType } from '../../../enums/pop-up-content-type.enum';

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

  constructor() { }

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
    }, 0);
  }

}
