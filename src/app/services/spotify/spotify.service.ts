import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenResponse } from '../../models/token-response.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Devices } from '../../models/devices.interface';
import { TrackAnalysis } from '../../models/track-analysis.interface';
import { Player } from '../../models/player.interface';
import { RepeatState } from '../../enums/repeat-state.enum';

@Injectable()
export class SpotifyService {

  private readonly clientId: string = '6a6b154241b04bc1bd0f4656b98d8aa4';
  private readonly clientSecret: string = 'e21ffa9272b14229896cf7003b46f8ae';
  private readonly redirectUri: string = 'http://localhost:4200/callback/';
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
  private _playerSubject: Subject<Player> = new BehaviorSubject<Player>(null);

  constructor(private _http: HttpClient,
              private _router: Router) {
    this.initializeTokenRefresher();
    setInterval(() => this.refreshPlayer(), 500);
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

  hasPlayerUpdated(): Observable<Player> {
    return this._playerSubject.asObservable();
  }

  spotifyAuth(): void {
    const scopes = this.scopes.join('%20');
    const redirectUri = this.redirectUri.replace('/', '%2F').replace(':', '%3A');
    const url = 'https://accounts.spotify.com/authorize?client_id=' + this.clientId + '&response_type=code&redirect_uri='
      + redirectUri + '&scope=' + scopes;
    window.open(url, '_self');
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
    const payload = new HttpParams()
      .append('redirect_uri', this.redirectUri)
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

  play(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const options = this.getOptions();

    return this._http.put(url, null, options);
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

  logout(): void {
    this.accessToken = '';
    this.refreshToken = '';
    this._router.navigate([ './' ]);
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

}
