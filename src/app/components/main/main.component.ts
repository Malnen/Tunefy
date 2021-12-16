import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { Router } from '@angular/router';
import { TokenResponse } from '../../models/token-response.interface';
import { ScriptLoaderService } from '../../services/script-loader/script-loader.service';
import { PlayerInitialized } from '../../models/player-initialized.interface';
import { Player } from '../../models/player.interface';
import { ColorsEnum } from '../../enums/colors.enum';

@Component({
  selector : 'app-main',
  templateUrl : './main.component.html',
  styleUrls : [ './main.component.scss' ],
})
export class MainComponent implements OnInit {

  playerInitialized = true;
  spinnerColor = ColorsEnum.ORANGE;

  constructor(private _router: Router,
              private _spotifyService: SpotifyService,
              private _scriptLoader: ScriptLoaderService) {
  }

  ngOnInit(): void {
    this.checkRefreshToken();
    this._spotifyService.refreshTokens();
    this._scriptLoader.loadSpotifyScript();
    this._scriptLoader.loadSpotifyPlayerScript();
    this.addPlayerInitializedEventListener();
  }

  private checkRefreshToken(): void {
    if (this._spotifyService.refreshToken == null || this._spotifyService.refreshToken === '') {
      this._router.navigate([ './' ]);
    }
  }

  private addPlayerInitializedEventListener(): void {
    window.addEventListener('playerInitialized', (event: PlayerInitialized) => {
      this._spotifyService.deviceId = event.id;
      this._spotifyService.getPlayer().subscribe((player: Player) => {
        if (player == null) {
          this._spotifyService.setAsCurrentDevice().subscribe((data: any) => {
          });
        }
      });
      this.playerInitialized = true;
    });
    window.addEventListener('playerFailed', (event: PlayerInitialized) => {
      this.playerInitialized = true;
    });
  }

}
