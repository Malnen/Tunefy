import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../../../models/image.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { Album } from '../../../../models/album.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';
import { ResizeService } from '../../../../services/resize-service/resize.service';

@Component({
  selector : 'app-album-tile',
  templateUrl : './album-tile.component.html',
  styleUrls : [ './album-tile.component.scss' ]
})
export class AlbumTileComponent extends BaseComponent implements OnInit {

  @Input() album: Album;

  image: Image;
  hasImage = true;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this.image = this.album.images[ 0 ];
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

  onImageError(): void {
    this.hasImage = false;
  }

  onClick(): void {
    const config = {
      contentType : ContentType.album,
      album : this.album
    };
    this._linkTileService.updateLinkTile(config);
  }

  private playAlbum(): void {
    this._spotifyService.playAlbum(this.album).subscribe();
  }

  private playAlbumRandom(): void {
    const offset = Math.floor(Math.random() * (this.album.total_tracks + 1));
    this._spotifyService.playAlbum(this.album, offset).subscribe();
  }

}
