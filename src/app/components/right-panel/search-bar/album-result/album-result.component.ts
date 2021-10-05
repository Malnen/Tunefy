import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../../../../models/album.interface';

@Component({
  selector : 'app-album-result',
  templateUrl : './album-result.component.html',
  styleUrls : [ './album-result.component.scss' ]
})
export class AlbumResultComponent implements OnInit {

  @Input() album: Album;

  hover: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

}
