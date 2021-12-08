import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base-component/base.component';
import { Image } from '../../../../models/image.interface';
import { Artist } from '../../../../models/artist.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ContentType } from '../../../../enums/content-type.enum';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';

@Component({
  selector : 'app-artist-tile',
  templateUrl : './artist-tile.component.html',
  styleUrls : [ './artist-tile.component.scss' ]
})
export class ArtistTileComponent extends BaseComponent implements OnInit {

  @Input() artist: Artist;

  image: Image;
  hasImage = true;

  constructor(contextMenuService: ContextMenuService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService);
  }

  ngOnInit(): void {
    this.image = this.artist.images[ 0 ];
    this.options = [
      {
        label : 'Przejdź do artysty',
        action : this.onClick.bind(this)
      }
    ];
  }

  onImageError(): void {
    this.hasImage = false;
  }

  onClick(): void {
    const config = {
      contentType : ContentType.artist,
      artist : this.artist
    };
    this._linkTileService.updateLinkTile(config);
  }

}
