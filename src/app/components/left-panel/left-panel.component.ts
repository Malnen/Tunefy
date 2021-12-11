import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Playlists } from '../../models/playlists.interface';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { LinkTileComponent } from './link-tile/link-tile.component';
import { ContentType } from '../../enums/content-type.enum';
import { DialogService } from '../../services/dialog/dialog.service';
import { PlaylistService } from '../../services/playlist-service/playlist.service';
import { BaseComponent } from '../base-component/base.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ResizeService } from '../../services/resize-service/resize.service';

@Component({
  selector : 'app-left-panel',
  templateUrl : './left-panel.component.html',
  styleUrls : [ './left-panel.component.scss' ]
})
export class LeftPanelComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('home') home: LinkTileComponent;

  topHover: boolean;
  bottomHover: boolean;
  playlists: Playlists;
  opened = false;

  contentType = ContentType;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _dialog: DialogService,
              private _spotifyService: SpotifyService,
              private _playlistService: PlaylistService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadPlaylists();
    this._dialog.hasPlaylistsUpdated().subscribe(() => {
      this.loadPlaylists();
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

  addPlaylist(): void {
    this._dialog.openAddPlaylistDialog();
  }

  onDrawerClick(): void {
    this.opened = !this.opened;
    console.log(this.opened);
  }

  private loadPlaylists(): void {
    this._spotifyService.getPlaylists(50).subscribe((playlists: Playlists) => {
      if (this.playlists) {
        this.playlists = null;
      }
      this.playlists = playlists;
      this._playlistService.updatePlaylists(this.playlists);
      this.getNextPlaylists();
    });
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
