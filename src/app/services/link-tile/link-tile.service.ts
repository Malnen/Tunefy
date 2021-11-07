import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Album } from '../../models/album.interface';
import { ActiveLinkConfig } from '../../models/active-link-config.interface';

@Injectable()
export class LinkTileService {

  private _linkHistory: ActiveLinkConfig[];
  private _lastLink: ActiveLinkConfig;
  private _currentIndex: number;
  private _linkTileSubject = new Subject<ActiveLinkConfig>();
  private _hasNextSubject = new Subject<boolean>();
  private _hasPreviousSubject = new Subject<boolean>();

  constructor() {
    this._linkHistory = [];
  }

  onHasNextUpdate(): Observable<boolean> {
    return this._hasNextSubject.asObservable();
  }

  onHasPreviousUpdate(): Observable<boolean> {
    return this._hasPreviousSubject.asObservable();
  }

  onLinkTileUpdate(): Observable<ActiveLinkConfig> {
    return this._linkTileSubject.asObservable();
  }

  updateLinkTile(value: ActiveLinkConfig): void {
    if (value !== this._lastLink && this._currentIndex < this._linkHistory.length - 1) {
      this._linkHistory = this._linkHistory.slice(0, this._currentIndex + 1);
    }

    this._linkHistory.push(value);
    this._lastLink = value;
    this._currentIndex = this._linkHistory.indexOf(value);
    this._linkTileSubject.next(value);

    this.checkHasNext();
    this.checkHasPrevious();
  }

  previous(): void {
    const previousIndex = this._currentIndex - 1;
    if (this._linkHistory.length > 0 && previousIndex >= 0) {
      const previous = this._linkHistory[ previousIndex ];
      this._currentIndex--;
      this._linkTileSubject.next(previous);
    }

    this.checkHasNext();
    this.checkHasPrevious();
  }

  next(): void {
    const size = this._linkHistory.length;
    const nextIndex = this._currentIndex + 1;
    if (nextIndex < size) {
      const next = this._linkHistory[ nextIndex ];
      this._currentIndex++;
      this._linkTileSubject.next(next);
    }

    this.checkHasNext();
    this.checkHasPrevious();
  }

  private checkHasNext(): void {
    const size = this._linkHistory.length;
    const hasNext = this._currentIndex < size - 1;

    this._hasNextSubject.next(hasNext);
  }

  private checkHasPrevious(): void {
    const hasPrevious = this._currentIndex > 0;

    this._hasPreviousSubject.next(hasPrevious);
  }

}
