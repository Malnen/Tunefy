import { Component, Input, OnInit } from '@angular/core';
import { ContentType } from '../../../../../enums/content-type.enum';
import { Artist } from '../../../../../models/artist.interface';
import { Album } from '../../../../../models/album.interface';

@Component({
  selector : 'app-horizontal-chart-info',
  templateUrl : './horizontal-chart-info.component.html',
  styleUrls : [ './horizontal-chart-info.component.scss' ]
})
export class HorizontalChartInfoComponent implements OnInit {

  @Input() contentType: ContentType;
  @Input() topArtist: Artist;
  @Input() topAlbum: Album;
  @Input() topGenres: string[];

  contentTypeEnum = ContentType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
