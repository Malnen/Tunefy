import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LinkTileComponent } from '../../components/left-panel/link-tile/link-tile.component';

@Injectable()
export class LinkTileService {

  private _linkTileSubject = new Subject<LinkTileComponent>();

  constructor() { }

  onLinkTileUpdate(): Observable<LinkTileComponent> {
    return this._linkTileSubject.asObservable();
  }

  updateLinkTile(value: LinkTileComponent): void {
    this._linkTileSubject.next(value);
  }

}
