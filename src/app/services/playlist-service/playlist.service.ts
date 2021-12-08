import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PlaylistTracks } from '../../models/playlist-tracks.interface';
import { Playlists } from '../../models/playlists.interface';

@Injectable()
export class PlaylistService {

  private _playlists = new BehaviorSubject<Playlists>(null);
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

  updatePlaylists(playlists: Playlists): void {
    this._playlists.next(playlists);
  }

  hasPlaylistsUpdated(): Observable<Playlists> {
    return this._playlists.asObservable();
  }

}
