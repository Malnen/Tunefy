import {Directive, Input, ElementRef, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[appSpinner]'
})
export class SpinnerDirective implements AfterViewInit {

  @Input() customColor: string;

  constructor(
    private elem: ElementRef) {
  }

  ngAfterViewInit(): void {
    if (!!this.customColor) {
      const element = this.elem.nativeElement;
      const circle = element.querySelector('circle');
      circle.style.stroke = this.customColor;
    }
  }

}
