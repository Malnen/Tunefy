import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlaylistTracks } from '../../models/playlist-tracks.interface';

@Injectable()
export class PlaylistService {

  private _nextLoaded = new Subject<void>();
  private _hasPlaylistChanged = new Subject<void>();
  private _followedTracks = new Subject<PlaylistTracks>();

  constructor() { }

  hasNextLoaded(): Observable<void> {
    return this._nextLoaded.asObservable();
  }

  updateNextLoaded(): void {
    this._nextLoaded.next();
  }

  hasPlaylistChanged(): Observable<void> {
    return this._hasPlaylistChanged.asObservable();
  }

  updatePlaylistChanged(): void {
    this._hasPlaylistChanged.next();
  }

}
