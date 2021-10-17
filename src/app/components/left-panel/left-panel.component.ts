import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Playlists } from '../../models/playlists.interface';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { LinkTileComponent } from './link-tile/link-tile.component';
import { ContentType } from '../../enums/content-type.enum';

@Component({
  selector : 'app-left-panel',
  templateUrl : './left-panel.component.html',
  styleUrls : [ './left-panel.component.scss' ]
})
export class LeftPanelComponent implements OnInit, AfterViewInit {

  @ViewChild('home') home: LinkTileComponent;

  topHover: boolean;
  bottomHover: boolean;
  playlists: Playlists;

  contentType = ContentType;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this._spotifyService.getPlaylists(50).subscribe((playlists: Playlists) => {
      this.playlists = playlists;
      this.getNextPlaylists();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.home.onTileClick(), 0);
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
