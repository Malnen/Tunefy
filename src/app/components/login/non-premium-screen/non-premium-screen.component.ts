import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';

@Component({
  selector: 'app-non-premium-screen',
  templateUrl: './non-premium-screen.component.html',
  styleUrls: ['./non-premium-screen.component.scss']
})
export class NonPremiumScreenComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this._spotifyService.logout(false);
  }

}
