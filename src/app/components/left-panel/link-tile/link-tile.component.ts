import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../../models/image.interface';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';
import { BaseComponent } from '../../base-component/base.component';
import { ContextMenuService } from '../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { ActiveLinkConfig } from '../../../models/active-link-config.interface';

@Component({
  selector : 'app-link-tile',
  templateUrl : './link-tile.component.html',
  styleUrls : [ './link-tile.component.scss' ]
})
export class LinkTileComponent extends BaseComponent implements OnInit {

  @Input() label: string;
  @Input() icon: string;
  @Input() activeLinkConfig: ActiveLinkConfig;

  image: Image;
  hasImage: boolean;
  isActive: boolean;

  constructor(contextMenuService: ContextMenuService,
              private _linkTileService: LinkTileService,
              private _spotifyService: SpotifyService,
              private _dialogService: DialogService) {super(contextMenuService); }

  ngOnInit(): void {
    this.image = this.activeLinkConfig?.playlist?.images[ 0 ];
    this.hasImage = this.image != null;
    this._linkTileService.onLinkTileUpdate().subscribe((config: ActiveLinkConfig) => {
      this.isActive = this.activeLinkConfig === config;
    });
    this.setOptions();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  onTileClick(): void {
    this._linkTileService.updateLinkTile(this.activeLinkConfig);
  }

  private setOptions(): void {
    if (this.activeLinkConfig?.playlist) {
      this.options = [
        {
          label : 'Usuń',
          action : this.deletePlaylist.bind(this)
        }
      ];
    }
  }

  private deletePlaylist(): void {
    this._dialogService.openDeletePlaylistDialog(this.activeLinkConfig.playlist);
  }

}
