import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PlaylistTracks } from '../../models/playlist-tracks.interface';
import { Playlists } from '../../models/playlists.interface';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class PlaylistService {

  private _playlists = new BehaviorSubject<Playlists>(null);
  private _nextLoaded = new Subject<void>();
  private _hasPlaylistChanged = new Subject<void>();

  constructor(private _spotifyService: SpotifyService) { }

  hasNextLoaded(): Observable<void> {
    return this._nextLoaded.asObservable();
  }

  updateNextLoaded(): void {
    this._nextLoaded.next();
  }

  refreshPlaylists(): void {
    let playlists;
    this._spotifyService.getPlaylists().subscribe((response: Playlists) => {
      playlists = response;
      this.loadNextPlaylists(playlists);
    });
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

  private loadNextPlaylists(playlists: Playlists): void {
    if (playlists.next != null) {
      this._spotifyService.getPlaylists().subscribe((response: Playlists) => {
        playlists.next = response.next;
        playlists.items.push(...response.items);
        this.loadNextPlaylists(playlists);
      });
    } else {
      this.updatePlaylists(playlists);
    }
  }

}
