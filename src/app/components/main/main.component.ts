import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify/spotify.service';
import {Router} from '@angular/router';
import {TokenResponse} from '../../models/token-response.interface';
import {ScriptLoaderService} from '../../services/script-loader/script-loader.service';
import {PlayerInitialized} from '../../models/player-initialized.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router,
              private spotifyService: SpotifyService,
              private scriptLoader: ScriptLoaderService) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
    this.scriptLoader.loadSpotifyScript();
    this.scriptLoader.loadSpotifyPlayerScript();
    this.addPlayerInitializedEventListener();
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

  private addPlayerInitializedEventListener(): void {
    window.addEventListener('playerInitialized', (event: PlayerInitialized) => {
      this.spotifyService.deviceId = event.id;
      this.spotifyService.setAsCurrentDevice().subscribe((data: any) => {
      });
    });
  }

}
