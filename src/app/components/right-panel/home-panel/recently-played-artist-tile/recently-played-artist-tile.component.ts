import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base-component/base.component';
import { Image } from '../../../../models/image.interface';
import { Artist } from '../../../../models/artist.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-recently-played-artist-tile',
  templateUrl : './recently-played-artist-tile.component.html',
  styleUrls : [ './recently-played-artist-tile.component.scss' ]
})
export class RecentlyPlayedArtistTileComponent extends BaseComponent implements OnInit {

  @Input() artist: Artist;

  image: Image;
  hasImage = true;

  constructor(contextMenuService: ContextMenuService) {
    super(contextMenuService);
  }

  ngOnInit(): void {
    this.image = this.artist.images[ 0 ];
  }

  onImageError(): void {
    this.hasImage = false;
  }

}
