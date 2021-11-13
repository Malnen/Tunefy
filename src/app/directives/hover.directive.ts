import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector : '[appHover]'
})
export class HoverDirective {

  @Output() hover: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _hover: boolean;

  constructor() {
  }

  @HostListener('mouseover') mouseover(): void {
    this._hover = true;
    this.hover.emit(this._hover);
  }

  @HostListener('mouseleave') mouseleave(): void {
    this._hover = false;
    this.hover.emit(this._hover);
  }

}
