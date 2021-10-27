import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../../models/image.interface';
import { Playlist } from '../../../models/playlist.interface';
import { ContentType } from '../../../enums/content-type.enum';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';
import { BaseComponent } from '../../base-component/base.component';
import { ContextMenuService } from '../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { DialogService } from '../../../services/dialog/dialog.service';

@Component({
  selector : 'app-link-tile',
  templateUrl : './link-tile.component.html',
  styleUrls : [ './link-tile.component.scss' ]
})
export class LinkTileComponent extends BaseComponent implements OnInit {

  @Input() label: string;
  @Input() icon: string;
  @Input() playlist: Playlist;
  @Input() contentType: ContentType;

  image: Image;
  hasImage: boolean;
  isActive: boolean;

  constructor(contextMenuService: ContextMenuService,
              private _linkTileService: LinkTileService,
              private _spotifyService: SpotifyService,
              private _dialogService: DialogService) {super(contextMenuService); }

  ngOnInit(): void {
    this.image = this.playlist?.images[ 0 ];
    this.hasImage = this.image != null;
    this._linkTileService.onLinkTileUpdate().subscribe((linkTile: LinkTileComponent) => {
      this.isActive = this === linkTile;
    });
    this.setOptions();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  onTileClick(): void {
    this._linkTileService.updateLinkTile(this);
  }

  private setOptions(): void {
    if (this.playlist) {
      this.options = [
        {
          label : 'Usuń',
          action : this.deletePlaylist.bind(this)
        }
      ];
    }
  }

  private deletePlaylist(): void {
    this._dialogService.openDeletePlaylistDialog(this.playlist);
  }

}
