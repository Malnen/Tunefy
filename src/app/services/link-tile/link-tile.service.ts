import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Album } from '../../models/album.interface';
import { ActiveLinkConfig } from '../../models/active-link-config.interface';

@Injectable()
export class LinkTileService {

  private _linkTileSubject = new Subject<ActiveLinkConfig>();

  constructor() { }

  onLinkTileUpdate(): Observable<ActiveLinkConfig> {
    return this._linkTileSubject.asObservable();
  }

  updateLinkTile(value: ActiveLinkConfig): void {
    this._linkTileSubject.next(value);
  }

}
