import { Component, OnInit } from '@angular/core';
import { Playlists } from '../../models/playlists.interface';
import { SpotifyService } from '../../services/spotify/spotify.service';

@Component({
  selector : 'app-left-panel',
  templateUrl : './left-panel.component.html',
  styleUrls : [ './left-panel.component.scss' ]
})
export class LeftPanelComponent implements OnInit {

  topHover: boolean;
  bottomHover: boolean;
  playlists: Playlists;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this._spotifyService.getPlaylists(50).subscribe((playlists: Playlists) => {
      this.playlists = playlists;
      this.getNextPlaylists();
    });
  }

  onTopHover(event: boolean): void {
    this.topHover = event;
  }

  onBottomHover(event: boolean): void {
    this.bottomHover = event;
  }

  private getNextPlaylists(): void {
    const next = this.playlists.next;
    if (next) {
      this._spotifyService.getPlaylists(50, next).subscribe((playlists: Playlists) => {
        this.playlists.next = playlists.next;
        this.playlists.items.push(...playlists.items);
        this.getNextPlaylists();
      });
    }
  }

}
