import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Option } from '../../models/option.interface';

@Injectable({
  providedIn : 'root'
})
export class ContextMenuService {

  private _lastOptions: Option[];
  private _options = new Subject<Option[]>();
  private _close = new Subject<void>();
  private _width = new BehaviorSubject<number>(0);
  private _height = new BehaviorSubject<number>(0);

  constructor() { }

  updateOptions(options: Option[]): void {
    this._lastOptions = options;
    this._options.next(options);
  }

  hasOptionsUpdated(): Observable<Option[]> {
    return this._options.asObservable();
  }

  closeContextMenu(): void {
    this._close.next();
  }

  shouldCloseContextMenu(): Observable<void> {
    return this._close.asObservable();
  }

  refresh(): void {
    this._options.next(this._lastOptions);
  }

  updateWidth(width: number): void {
    if (this._width.value < width) {
      this._width.next(width);
    }
  }

  updateHeight(height: number): void {
    if (this._height.value < height) {
      this._height.next(height);
    }
  }

  hasWidthUpdated(): Observable<number> {
    return this._width.asObservable();
  }

  hasHeightUpdated(): Observable<number> {
    return this._height.asObservable();
  }

}
