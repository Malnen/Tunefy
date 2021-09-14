import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify/spotify.service';
import {Router} from '@angular/router';
import {Animations} from '../../animations/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [Animations.buttonSize]
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
    if (this._spotifyService.refreshToken != null && this._spotifyService.refreshToken !== '') {
      this._router.navigate(['./main']);
    }
  }

}
