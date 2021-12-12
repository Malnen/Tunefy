import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { Router } from '@angular/router';
import { Animations } from '../../animations/animations';
import { TokenResponse } from '../../models/token-response.interface';

@Component({
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.scss' ],
  animations : [ Animations.buttonSize ]
})
export class LoginComponent implements OnInit {

  isHover = false;

  constructor(private _spotifyService: SpotifyService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
  }

  spotifyAuth(): void {
    this._spotifyService.spotifyAuth();
  }

  onMouseOver(): void {
    this.isHover = true;
  }

  onMouseLeave(): void {
    this.isHover = false;
  }

  private checkRefreshToken(): void {
    this._spotifyService.spotifyRefreshToken().subscribe((data: TokenResponse) => {
      if (data.refresh_token) {
        this._spotifyService.refreshToken = data.refresh_token;
      }
      if (data.access_token) {
        this._spotifyService.accessToken = data.access_token;
      }
      if (this._spotifyService.refreshToken != null && this._spotifyService.refreshToken !== '') {
        this._router.navigate([ './main' ]);
      }
    });
  }

}
