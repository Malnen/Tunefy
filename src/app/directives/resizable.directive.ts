import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { ColorsEnum } from '../enums/colors.enum';

@Directive({
  selector : '[appResizable]'
})

export class ResizableDirective implements OnInit {

  @Input() resizableGrabWidth = 16;
  @Input() resizableMinWidth = 10;
  @Input() resizableMaxWidth = 1920;

  colors = ColorsEnum;
  dragging = false;

  constructor(private _el: ElementRef) {
    this._el.nativeElement.style.transition = 'border 0.2s';
    const setNewWidth = (width: number) => {
      let newWidth = Math.max(this.resizableMinWidth, width);
      newWidth = Math.min(this.resizableMaxWidth, newWidth);
      _el.nativeElement.style.width = (newWidth) + 'px';
    };

    const mouseMoveG = (event: MouseEvent) => {
      if (!this.dragging) {
        return;
      }

      const width = event.clientX - _el.nativeElement.offsetLeft;
      setNewWidth(width);
      event.stopPropagation();
    };

    const mouseUpG = (event: MouseEvent) => {
      if (!this.dragging) {
        return;
      }

      this.restoreGlobalMouseEvents();
      this.dragging = false;
      event.stopPropagation();
      this.setBorderTransparent();
    };

    const mouseDown = (event: MouseEvent) => {
      if (this.inDragRegion(event)) {
        this.dragging = true;
        this.preventGlobalMouseEvents();
        event.stopPropagation();
        this.setBorderColored();
      }
    };

    const mouseMove = (event: MouseEvent) => {
      const isInDragRegion = this.inDragRegion(event);
      if (isInDragRegion || this.dragging) {
        _el.nativeElement.style.cursor = 'col-resize';
      } else {
        _el.nativeElement.style.cursor = 'default';
      }

      if (isInDragRegion) {
        this.setBorderColored();
      } else {
        this.setBorderTransparent();
      }
    };

    const mouseLeave = () => {
      if (!this.dragging) {
        this.setBorderTransparent();
      }
    };

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    _el.nativeElement.addEventListener('mousedown', mouseDown, true);
    _el.nativeElement.addEventListener('mousemove', mouseMove, true);
    _el.nativeElement.addEventListener('mouseleave', mouseLeave, true);
  }

  ngOnInit(): void {
    this._el.nativeElement.style.width = this.resizableMinWidth + 'px';
    this.setBorderTransparent();
  }

  private inDragRegion(event: MouseEvent): boolean {
    return this._el.nativeElement.clientWidth - event.clientX + this._el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }

  private preventGlobalMouseEvents(): void {
    document.body.style[ 'pointer-events' ] = 'none';
  }

  private restoreGlobalMouseEvents(): void {
    document.body.style[ 'pointer-events' ] = 'auto';
  }

  private setBorderTransparent(): void {
    this._el.nativeElement.style[ 'border-right' ] = 2 + 'px solid rgba(0,0,0,0)';
  }

  private setBorderColored(): void {
    this._el.nativeElement.style[ 'border-right' ] = 2 + `px solid ${ this.colors.RESIZABLE_BORDER }`;
  }

}
