import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Album } from '../../../../models/album.interface';
import { HoverableComponent } from '../../../hoverable/hoverable.component';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';

@Component({
  selector : 'app-album-result',
  templateUrl : './album-result.component.html',
  styleUrls : [ './album-result.component.scss' ]
})
export class AlbumResultComponent extends BaseComponent implements OnInit {

  @Input() album: Album;

  @Output() close = new EventEmitter<void>();

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this.options = [
      {
        label : 'Odtwarzaj',
        action : this.playAlbum.bind(this)
      },
      {
        label : 'Odtwarzaj losowo',
        action : this.playAlbumRandom.bind(this),
        showDivider : true
      },
      {
        label : 'Przejdź do albumu',
        action : this.onClick.bind(this)
      }
    ];
  }

  onClick(): void {
    const config = {
      contentType : ContentType.album,
      album : this.album
    };
    this._linkTileService.updateLinkTile(config);
    this.close.emit();
  }

  private playAlbum(): void {
    this._spotifyService.playAlbum(this.album).subscribe();
  }

  private playAlbumRandom(): void {
    const offset = Math.floor(Math.random() * (this.album.total_tracks + 1));
    this._spotifyService.playAlbum(this.album, offset).subscribe();
  }

}
