import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../../../models/image.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { Album } from '../../../../models/album.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';

@Component({
  selector: 'app-album-tile',
  templateUrl: './album-tile.component.html',
  styleUrls: ['./album-tile.component.scss']
})
export class AlbumTileComponent extends BaseComponent implements OnInit {

  @Input() album: Album;

  image: Image;
  hasImage = true;

  constructor(contextMenuService: ContextMenuService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService);
  }

  ngOnInit(): void {
    this.image = this.album.images[ 0 ];
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

}
