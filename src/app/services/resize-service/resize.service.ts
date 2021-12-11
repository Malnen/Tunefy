import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ScreenSize } from '../../models/screen-size.interface';

@Injectable({
  providedIn : 'root'
})
export class ResizeService {

  size: ScreenSize;

  private _size = new Subject<ScreenSize>();

  constructor() { }

  updateSize(size: ScreenSize): void {
    this._size.next(size);
    this.size = size;
  }

  hasSizeUpdated(): Observable<ScreenSize> {
    return this._size.asObservable();
  }

}
