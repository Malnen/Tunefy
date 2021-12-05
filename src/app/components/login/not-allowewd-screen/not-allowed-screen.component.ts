import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';

@Component({
  selector : 'app-not-allowewd-screen',
  templateUrl : './not-allowed-screen.component.html',
  styleUrls : [ './not-allowed-screen.component.scss' ]
})
export class NotAllowedScreenComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this._spotifyService.userAllowed = false;
  }

  logout(): void {
    this._spotifyService.logout(false);
  }

}
