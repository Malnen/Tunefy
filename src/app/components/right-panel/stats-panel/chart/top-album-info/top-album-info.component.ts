import { Component, Input, OnChanges } from '@angular/core';
import { Image } from '../../../../../models/image.interface';
import { Album } from '../../../../../models/album.interface';

@Component({
  selector : 'app-top-album-info',
  templateUrl : './top-album-info.component.html',
  styleUrls : [ './top-album-info.component.scss' ]
})
export class TopAlbumInfoComponent implements OnChanges {

  @Input() album: Album;

  image: Image;
  hasImage = true;

  constructor() { }

  ngOnChanges(): void {
    this.setImage();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  private setImage(): void {
    this.image = this.album?.images[ 0 ];
    this.hasImage = true;
  }

}
