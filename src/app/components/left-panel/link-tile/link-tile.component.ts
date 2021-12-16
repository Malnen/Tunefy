import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Image } from '../../../models/image.interface';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';
import { BaseComponent } from '../../base-component/base.component';
import { ContextMenuService } from '../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { ActiveLinkConfig } from '../../../models/active-link-config.interface';
import { Player } from '../../../models/player.interface';
import { ContentType } from '../../../enums/content-type.enum';
import { ResizeService } from '../../../services/resize-service/resize.service';

@Component({
  selector : 'app-link-tile',
  templateUrl : './link-tile.component.html',
  styleUrls : [ './link-tile.component.scss' ]
})
export class LinkTileComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input() label: string;
  @Input() icon: string;
  @Input() activeLinkConfig: ActiveLinkConfig;

  image: Image;
  hasImage: boolean;
  isActive: boolean;
  isCurrent: boolean;

  private _player: Player;
  private _initialized = false;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _linkTileService: LinkTileService,
              private _spotifyService: SpotifyService,
              private _dialogService: DialogService) {super(contextMenuService, resizeService); }

  ngOnInit(): void {
    this.image = this.activeLinkConfig?.playlist?.images[ 0 ];
    this.hasImage = this.image != null;
    this._linkTileService.onLinkTileUpdate().subscribe((activeLinkConfig: ActiveLinkConfig) => {
      this.isActive = this.activeLinkConfig === activeLinkConfig;
    });
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this._player = player;
      this.setIsCurrent(player);
    });
    this.setOptions();
  }

  ngAfterViewInit(): void {
    this._initialized = true;
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
          label : 'Odtwarzaj',
          action : this.play.bind(this)
        },
        {
          label : 'Odtwarzaj losowo',
          action : this.playRandom.bind(this),
          showDivider : true
        },
        {
          label : 'Usuń',
          action : this.deletePlaylist.bind(this)
        }
      ];
    }
  }

  private play(): void {
    this._spotifyService.playPlaylist(this.activeLinkConfig.playlist).subscribe();
    this._spotifyService.setShuffleState(false).subscribe();
  }

  private playRandom(): void {
    const offset = Math.floor(Math.random() * (this.activeLinkConfig.playlist.tracks.total + 1));
    this._spotifyService.playPlaylist(this.activeLinkConfig.playlist, offset).subscribe();
  }

  private deletePlaylist(): void {
    this._dialogService.openDeletePlaylistDialog(this.activeLinkConfig.playlist);
  }

  private setIsCurrent(player: Player): void {
    const contentType = this.activeLinkConfig.contentType;
    const excludedTypes = [
      ContentType.home,
      ContentType.local,
      ContentType.stats,
      ContentType.discover
    ];
    if (excludedTypes.includes(contentType)) {
      this.isCurrent = false;
    } else {
      const uri = this.activeLinkConfig?.playlist?.uri;
      const playerUri = player?.context?.uri;
      this.isCurrent = uri === playerUri && this._initialized && player.is_playing;
    }
  }

}
