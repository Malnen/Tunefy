import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../login/service/spotify.service';
import {Router} from '@angular/router';
import {TokenResponse} from '../login/models/token-response.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router,
              private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
  }

  onPlay(): void {
    this.spotifyService.play().subscribe((data: any) => {
    });
  }

  onPause(): void {
    this.spotifyService.pause().subscribe((data: any) => {
    });
  }

  logout(): void {
    this.spotifyService.logout();
  }


  private checkRefreshToken(): void {
    if (this.spotifyService.refreshToken == null) {
      this.router.navigate(['./']);
    }
  }

}
