import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../../../../models/album.interface';
import { HoverableComponent } from '../../../hoverable/hoverable.component';

@Component({
  selector : 'app-album-result',
  templateUrl : './album-result.component.html',
  styleUrls : [ './album-result.component.scss' ]
})
export class AlbumResultComponent extends HoverableComponent implements OnInit {

  @Input() album: Album;

  constructor() {super(); }

  ngOnInit(): void {
  }

}
