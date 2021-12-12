import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artist } from '../../../../models/artist.interface';
import { HoverableComponent } from '../../../hoverable/hoverable.component';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { SnackBarService } from '../../../../services/snack-bar-service/snack-bar.service';

@Component({
  selector : 'app-artist-result',
  templateUrl : './artist-result.component.html',
  styleUrls : [ './artist-result.component.scss' ]
})
export class ArtistResultComponent extends BaseComponent implements OnInit {

  @Input() artist: Artist;

  @Output() close = new EventEmitter<void>();

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this.options = [
      {
        label : 'Przejdź do artysty',
        action : this.onClick.bind(this)
      }
    ];
  }

  onClick(): void {
    const config = {
      contentType : ContentType.artist,
      artist : this.artist
    };
    this._linkTileService.updateLinkTile(config);
    this.close.emit();
  }

}
