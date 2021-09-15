import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player.interface';
import { SpotifyService } from '../../services/spotify/spotify.service';

@Component({
  selector : 'app-bottom-panel',
  templateUrl : './bottom-panel.component.html',
  styleUrls : [ './bottom-panel.component.scss' ]
})
export class BottomPanelComponent implements OnInit {

  player: Player;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
    });
  }

  previous(): void {
    this._spotifyService.previous().subscribe((data: any) => {

    });
  }

  play(): void {
    this._spotifyService.play().subscribe((data: any) => {

    });
  }

  pause(): void {
    this._spotifyService.pause().subscribe((data: any) => {

    });
  }

  next(): void {
    this._spotifyService.next().subscribe((data: any) => {

    });
  }

}
