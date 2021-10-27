import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Option } from '../../models/option.interface';

@Injectable({
  providedIn : 'root'
})
export class ContextMenuService {

  private _lastOptions: Option[];
  private _options = new Subject<Option[]>();
  private _close = new Subject<void>();

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

}
