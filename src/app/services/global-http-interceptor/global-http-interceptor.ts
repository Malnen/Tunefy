import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpotifyService } from '../spotify/spotify.service';
import { TokenResponse } from '../../models/token-response.interface';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private _spotifyService: SpotifyService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case 401:
            this._spotifyService.spotifyRefreshToken().subscribe((data: TokenResponse) => {
              if (data.refresh_token) {
                this._spotifyService.refreshToken = data.refresh_token;
              }
              if (data.access_token) {
                this._spotifyService.accessToken = data.access_token;
              }

              return next.handle(req);
            });
            break;
          case 404:
            if (error.error.error.reason === 'NO_ACTIVE_DEVICE') {
              this._spotifyService.refreshTokens();
              this._spotifyService.setAsCurrentDevice();
              this._spotifyService.forcePlay();
              return next.handle(req);
            }

            break;
        }

        return throwError(error.message);
      })
    );
  }
}
