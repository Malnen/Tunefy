import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenResponse } from '../../models/token-response.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Devices } from '../../models/devices.interface';
import { TrackAnalysis } from '../../models/track-analysis.interface';
import { Player } from '../../models/player.interface';
import { RepeatState } from '../../enums/repeat-state.enum';
import { SearchResponse } from '../../models/search-response.interface';
import { Item } from '../../models/item.interface';
import { Playlists } from '../../models/playlists.interface';
import { RecentlyPlayed } from '../../models/recently-played.interface';
import { Artists } from '../../models/artists.interface';
import { PlaylistTracks } from '../../models/playlist-tracks.interface';
import { Playlist } from '../../models/playlist.interface';
import { PlaylistItem } from '../../models/playlist-item.interface';
import { Profile } from '../../models/profile.interface';
import { Album } from '../../models/album.interface';
import { ArtistTopTracks } from '../../models/artist-top-tracks.interface';
import { ArtistsAlbumsResponse } from '../../models/artists-albums-response.interface';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { DateRange } from '../../models/date-range.interface';

@Injectable()
export class SpotifyService {

  userAllowed = true;

  private readonly clientId: string = '6a6b154241b04bc1bd0f4656b98d8aa4'; // 'f65acf8953b54bd0b83627545be8ece4';
  private readonly clientSecret: string = 'e21ffa9272b14229896cf7003b46f8ae'; // '0cba5ea640b241b294596f215bbe9e15';
  private readonly scopes: string[] = [
    'ugc-image-upload',
    'user-read-recently-played',
    'user-top-read',
    'user-read-playback-position',
    'user-read-playback-state',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'streaming',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-modify',
    'user-follow-read',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
    'user-read-private'
  ];

  private _refreshToken: string;
  private _accessToken: string;
  private _deviceId: string;
  private _playerSubject = new BehaviorSubject<Player>(null);
  private _wait = false;
  private _waitTimer: any;
  private _playerTimer: any;
  private _profile: Profile;
  private _profileSubject = new Subject<Profile>();
  private _lastFollowedUris = [];
  private _player: Player;
  private _redirectUri: string;
  private _recentlyPlayed = new Subject<RecentlyPlayed>();

  constructor(private _http: HttpClient,
              private _router: Router,
              private _scriptsLoader: ScriptLoaderService) {
    this._redirectUri = window.location.href + 'callback/';
    this.initializeTokenRefresher();
    this._playerTimer = setInterval(() => this.refreshPlayer(), 500);
    this.hasProfileUpdate().subscribe((profile: Profile) => this._profile = profile);
    this.hasPlayerUpdated().subscribe((player: Player) => this._player = player);
  }

  get accessToken(): string {
    if (this._accessToken != null) {
      return this._accessToken;
    } else {
      return localStorage.getItem('accessToken');
    }
  }

  set accessToken(value: string) {
    localStorage.setItem('accessToken', value);
    this._accessToken = value;
  }

  set refreshToken(value: string) {
    localStorage.setItem('refreshToken', value);
    this._refreshToken = value;
  }

  get refreshToken(): string {
    if (this._refreshToken != null) {
      return this._refreshToken;
    } else {
      return localStorage.getItem('refreshToken');
    }
  }

  get deviceId(): string {
    return this._deviceId;
  }

  set deviceId(value: string) {
    this._deviceId = value;
  }

  getCurrentProfile(): Profile {
    return this._profile;
  }

  hasPlayerUpdated(): Observable<Player> {
    return this._playerSubject.asObservable();
  }

  hasProfileUpdate(): Observable<Profile> {
    return this._profileSubject.asObservable();
  }

  updateProfile(profile: Profile): void {
    this._profileSubject.next(profile);
  }

  hasRecentlyPlayedUpdate(): Observable<RecentlyPlayed> {
    return this._recentlyPlayed.asObservable();
  }

  updateRecentlyPlayed(recentlyPlayed: RecentlyPlayed): void {
    this._recentlyPlayed.next(recentlyPlayed);
  }

  spotifyAuth(): void {
    const scopes = this.scopes.join('%20');
    this.formatRedirectUri();
    let url = 'https://accounts.spotify.com/authorize?client_id=' + this.clientId + '&response_type=code&redirect_uri='
      + this._redirectUri + '&scope=' + scopes;
    const showDialog = localStorage.getItem('showDialog');
    if (showDialog == null || showDialog === 'true') {
      url += '&show_dialog=true';
      localStorage.setItem('showDialog', 'false');
    }

    window.location.href = url;
  }

  refreshTokens(): void {
    this.spotifyRefreshToken().subscribe((data: TokenResponse) => {
      if (data.refresh_token) {
        this.refreshToken = data.refresh_token;
      }
      if (data.access_token) {
        this.accessToken = data.access_token;
      }
    });
  }

  spotifyRefreshToken(): Observable<TokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    const isRefreshTokenPresent = this.refreshToken !== '' && this.refreshToken != null;
    this.formatRedirectUri();
    const payload = new HttpParams()
      .append('redirect_uri', this._redirectUri)
      .append('client_id', this.clientId)
      .append('client_secret', this.clientSecret)
      .append('grant_type',
        isRefreshTokenPresent ? 'refresh_token' : 'authorization_code')
      .append(isRefreshTokenPresent ? 'refresh_token' : 'code',
        isRefreshTokenPresent ? this.refreshToken : this.accessToken);

    const options = { headers };
    const url = 'https://accounts.spotify.com/api/token';

    return this._http.post<TokenResponse>(url, payload.toString(), options);
  }

  play(track?: Item): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    let payload = {};
    if (track != null) {
      payload = {
        context_uri : track?.album.uri,
        offset : {
          position : track.track_number - 1
        }
      };
    }

    return this._http.put(url, payload, options);
  }

  forcePlay(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player';
    const options = this.getOptions();
    const paylaod = {
      device_ids : [
        this.deviceId
      ],
      play : true
    };

    return this._http.put(url, paylaod, options);
  }

  pause(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/pause';
    const options = this.getOptions();

    return this._http.put(url, null, options);
  }

  previous(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/previous';
    const options = this.getOptions();

    return this._http.post(url, null, options);
  }

  next(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/next';
    const options = this.getOptions();

    return this._http.post(url, null, options);
  }

  logout(withReload = true): void {
    if (this._player?.device.id === this.deviceId) {
      this.pause();
    }
    this.accessToken = '';
    this.refreshToken = '';
    this._scriptsLoader.removeScripts();
    this._router.navigate([ './' ]);
    localStorage.setItem('showDialog', 'true');
    if (withReload) {
      window.location.reload();
    }
  }

  updateLastFollowedUris(uris: string[]): void {
    this._lastFollowedUris = uris;
  }

  setAsCurrentDevice(id?: string): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player';
    const options = this.getOptions();
    const paylaod = {
      device_ids : [
        id ?? this.deviceId
      ]
    };

    return this._http.put(url, paylaod, options);
  }

  setVolume(volume: number): Observable<any> {
    const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${ volume }`;
    const options = this.getOptions();
    const paylaod = {};

    return this._http.put(url, paylaod, options);
  }

  getDevices(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/devices';
    const options = this.getOptions();

    return this._http.get<Devices>(url, options);
  }

  getTrackAnalisys(): Observable<any> {
    const url = 'https://api.spotify.com/v1/audio-analysis/11dFghVXANMlKmJXsNCbNl';
    const options = this.getOptions();

    return this._http.get<TrackAnalysis>(url, options);
  }

  getPlayer(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player';
    const options = this.getOptions();

    return this._http.get<Player>(url, options);
  }

  seek(ms: number): Observable<any> {
    const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${ ms }`;
    const options = this.getOptions();
    const payload = {};

    return this._http.put(url, payload, options);
  }

  setRepeatState(state: RepeatState): Observable<any> {
    const url = `https://api.spotify.com/v1/me/player/repeat?state=${ state }`;
    const options = this.getOptions();
    const payload = {};

    return this._http.put(url, payload, options);
  }

  setShuffleState(state: boolean): Observable<any> {
    const url = `https://api.spotify.com/v1/me/player/shuffle?state=${ state }`;
    const options = this.getOptions();
    const payload = {};

    return this._http.put(url, payload, options);
  }

  refreshPlayer(): void {
    const canUpdate = !(this._wait || !this.userAllowed || !(this.accessToken && this.refreshToken));
    if (canUpdate) {
      this.getPlayer().subscribe((player: Player) => {
        if (player == null) {
          if (this.deviceId != null) {
            this.setAsCurrentDevice().subscribe((data: any) => {
            });
          }
        } else {
          this._playerSubject.next(player);
        }
      });
    }
  }

  search(query: string): Observable<any> {
    const url = `https://api.spotify.com/v1/search?q=${ encodeURI(query) }&type=track%2Calbum%2Cartist&limit=5&offset=0`;
    const options = this.getOptions();

    return this._http.get<SearchResponse>(url, options);
  }

  wait(): void {
    this._wait = true;
    clearTimeout(this._waitTimer);
    this._waitTimer = setTimeout(() => this._wait = false, 15000);
  }

  userNotAllowed(): void {
    this._wait = true;
    clearTimeout(this._waitTimer);
    this.userAllowed = false;
    this._router.navigate([ './userNotAllowed' ]);
  }

  addTrackToQueue(track: Item): Observable<any> {
    const url = `https://api.spotify.com/v1/me/player/queue?uri=${ track.uri }`;
    const options = this.getOptions();

    return this._http.post(url, null, options);
  }

  getProfile(): Observable<any> {
    const url = `https://api.spotify.com/v1/me`;
    const options = this.getOptions();

    return this._http.get<SearchResponse>(url, options);
  }

  getPlaylists(limit = 50, newUrl?: string): Observable<any> {
    const url = newUrl ?? `https://api.spotify.com/v1/me/playlists?limit=${ limit }`;
    const options = this.getOptions();

    return this._http.get<Playlists>(url, options);
  }

  getRecentlyPlayed(next?: string): Observable<any> {
    const url = next ?? `https://api.spotify.com/v1/me/player/recently-played?limit=50`;
    const options = this.getOptions();

    return this._http.get<RecentlyPlayed>(url, options);
  }

  getArtists(ids: string[]): Observable<any> {
    const url = `https://api.spotify.com/v1/artists?ids=${ ids.join('%2C') }`;
    const options = this.getOptions();

    return this._http.get<Artists>(url, options);
  }

  getTracks(playlistId: string, next?: string): Observable<any> {
    const url = next != null ? `${ next }&market=from_token` : `https://api.spotify.com/v1/playlists/${ playlistId }/tracks?market=from_token&limit=50&offset=0`;
    const options = this.getOptions();

    return this._http.get<PlaylistTracks>(url, options);
  }

  getFollowedTracks(next?: string): Observable<any> {
    const url = next != null ? `${ next }&market=from_token` : `https://api.spotify.com/v1/me/tracks?market=from_token&limit=50&offset=0`;
    const options = this.getOptions();

    return this._http.get<PlaylistTracks>(url, options);
  }

  getAlbumTracks(id: string, next?: string): Observable<any> {
    const url = next != null ? `${ next }&market=from_token` : `https://api.spotify.com/v1/albums/${ id }?market=from_token&limit=50&offset=0`;
    const options = this.getOptions();

    return this._http.get<PlaylistTracks>(url, options);
  }

  checkIfTrackAreFollowed(items: PlaylistItem[]): Observable<any> {
    const ids = items.map((item: PlaylistItem) => item.track.id);
    const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${ ids.join(',') }`;
    const options = this.getOptions();

    return this._http.get<PlaylistTracks>(url, options);
  }

  checkIfTrackItemAreFollowed(items: Item[]): Observable<any> {
    const ids = items.map((item: Item) => item.id);
    const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${ ids.join(',') }`;
    const options = this.getOptions();

    return this._http.get<PlaylistTracks>(url, options);
  }

  playPlaylist(playlist: Playlist, offset?: number): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    const payload = {
      context_uri : playlist.uri,
      offset : {
        position : offset ?? 0
      }
    };

    return this._http.put(url, payload, options);
  }

  followTrack(id: string): Observable<any> {
    const url = `https://api.spotify.com/v1/me/tracks?ids=${ id }`;
    const options = this.getOptions();

    return this._http.put(url, null, options);
  }

  unFollowTrack(id: string): Observable<any> {
    const url = `https://api.spotify.com/v1/me/tracks?ids=${ id }`;
    const options = this.getOptions();

    return this._http.delete(url, options);
  }

  playAlbum(album: Album, offset?: number): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    const payload = {
      context_uri : album.uri,
      offset : {
        position : offset ?? 0
      }
    };

    return this._http.put(url, payload, options);
  }

  addTracksToPlaylist(id: string, uris: string[]): Observable<any> {
    const urisString = uris.join('%2C').replace(/:/g, '%3A');
    const url = `https://api.spotify.com/v1/playlists/${ id }/tracks?uris=${ urisString }`;
    const options = this.getOptions();

    return this._http.post(url, null, options);
  }

  deleteTracksToPlaylist(id: string, uris: string[]): Observable<any> {
    const urisArray = [];
    for (const uri of uris) {
      urisArray.push({
        uri
      });
    }
    const url = `https://api.spotify.com/v1/playlists/${ id }/tracks`;
    const options = this.getOptionsWithBody(
      {
        tracks : urisArray
      }
    );

    return this._http.delete(url, options);
  }

  playFromUris(uris: string[], offset?: number): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    const payload = {
      uris,
      offset : {
        position : offset ?? 0
      }
    };

    return this._http.put(url, payload, options);
  }

  playFromLastFollowedUris(index: number): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    const size = 400;
    let uris;
    let position;
    if (index < size / 2) {
      position = index;
      uris = this._lastFollowedUris.slice(0, size);
    } else {
      const start = index - size / 2;
      const end = start + size;
      position = size / 2;
      uris = this._lastFollowedUris.slice(start, end);
    }
    const payload = {
      uris,
      offset : {
        position
      }
    };

    return this._http.put(url, payload, options);
  }

  playFollowed(playlist: Playlist): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();
    const payload = {
      context_uri : playlist.uri
    };

    return this._http.put(url, payload, options);
  }

  creatPlaylist(name: string): Observable<any> {
    const url = `	https://api.spotify.com/v1/users/${ this._profile.id }/playlists`;
    const options = this.getOptions();
    const payload = {
      name,
      public : true
    };

    return this._http.post(url, payload, options);
  }

  deletePlaylist(id: string): Observable<any> {
    const url = `https://api.spotify.com/v1/playlists/${ id }/followers`;
    const options = this.getOptions();

    return this._http.delete(url, options);
  }

  getRelatedArtists(id: string): Observable<any> {
    const url = `https://api.spotify.com/v1/artists/${ id }/related-artists`;
    const options = this.getOptions();

    return this._http.get<Artists>(url, options);
  }

  getArtistTopTracks(id: string): Observable<any> {
    const url = `https://api.spotify.com/v1/artists/${ id }/top-tracks?market=from_token`;
    const options = this.getOptions();

    return this._http.get<ArtistTopTracks>(url, options);
  }

  getArtistAlbums(id: string, next?: string): Observable<any> {
    const url = next ?? `https://api.spotify.com/v1/artists/${ id }/albums?market=from_token&include_groups=album`;
    const options = this.getOptions();

    return this._http.get<ArtistsAlbumsResponse>(url, options);
  }

  private formatRedirectUri(): void {
    this._redirectUri = this._redirectUri.replace('main', '');
    this._redirectUri = this._redirectUri.replace('userNotAllowed', '');
    this._redirectUri = this._redirectUri.replace('nonPremium', '');
    const index = this._redirectUri.indexOf('?');
    if (index > -1) {
      const toRemove = this._redirectUri.substring(index);
      this._redirectUri = this._redirectUri.replace(toRemove, '');
    }

    if (!this._redirectUri.endsWith('/')) {
      this._redirectUri = this._redirectUri + '/';
    }
  }

  private setRedirectUri(): void {
    const origin = window.location.origin;
    if (origin.includes('localhost')) {
      this._redirectUri = origin + '/callback/';
    } else {
      this._redirectUri = origin + '/Tunefy/callback/';
    }
  }

  private initializeTokenRefresher(): void {
    setInterval(() => {
      this.refreshTokens();
    }, 1000 * 3000);
  }

  private getOptions(): any {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      Authorization : `Bearer ${ this.accessToken }`
    });
    return { headers };
  }

  private getOptionsWithBody(body: any): any {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      Authorization : `Bearer ${ this.accessToken }`
    });
    return { headers, body };
  }

}
