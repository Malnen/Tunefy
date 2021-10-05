import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector : '[appContextMenuClickedOutside]'
})
export class ContextMenuClickedOutsideDirective {

  @Input() clickedOutside: boolean;
  @Input() parent: HTMLElement;

  @Output() clickOutside = new EventEmitter<void>();
  @Output() clickedInsideParent = new EventEmitter<MouseEvent>();

  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:contextmenu', [ '$event' ])
  public onContextMenu(event: MouseEvent): void {
    if (this.clickedOutside) {
      this.processClickEvent(event);
    }
  }
  @HostListener('document:click')
  public onClick(): void {
    this.clickOutside.emit();
  }

  private processClickEvent(event: MouseEvent): void {
    const nativeElement = this._elementRef.nativeElement;
    const targetElement = event.target as HTMLElement;
    const isClickedInside = this.isClickedInside(nativeElement, targetElement);
    const isInsideParent = this.parent != null ? this.isClickedInside(this.parent, targetElement) : true;

    if (!isClickedInside && !isInsideParent) {
      this.clickOutside.emit();
    } else if (isInsideParent) {
      this.clickedInsideParent.emit(event);
    }
  }

  private isClickedInside(nativeElement: HTMLElement, targetElement: HTMLElement): boolean {
    return nativeElement.contains(targetElement);
  }

}
