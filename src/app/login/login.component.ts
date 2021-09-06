import {Component, OnInit} from '@angular/core';
import {SpotifyService} from './service/spotify.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private spotifyService: SpotifyService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
  }

  spotifyAuth(): void {
    this.spotifyService.spotifyAuth();
  }

  private checkRefreshToken(): void {
    if (this.spotifyService.refreshToken != null && this.spotifyService.refreshToken !== '') {
      this.router.navigate(['./main']);
    }
  }

}
