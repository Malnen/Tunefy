import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base-component/base.component';
import { Image } from '../../../../models/image.interface';
import { Artist } from '../../../../models/artist.interface';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-artist-tile',
  templateUrl : './artist-tile.component.html',
  styleUrls : [ './artist-tile.component.scss' ]
})
export class ArtistTileComponent extends BaseComponent implements OnInit {

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
