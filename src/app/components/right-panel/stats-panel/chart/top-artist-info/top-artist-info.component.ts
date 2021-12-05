import { Component, Input, OnChanges } from '@angular/core';
import { Artist } from '../../../../../models/artist.interface';
import { Image } from '../../../../../models/image.interface';

@Component({
  selector : 'app-top-artist-info',
  templateUrl : './top-artist-info.component.html',
  styleUrls : [ './top-artist-info.component.scss' ]
})
export class TopArtistInfoComponent implements OnChanges {

  @Input() artist: Artist;

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
    this.image = this.artist?.images[ 0 ];
    this.hasImage = true;
  }

}
