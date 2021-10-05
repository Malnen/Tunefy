import { Component, Input, OnInit } from '@angular/core';
import { Artist } from '../../../../models/artist.interface';

@Component({
  selector : 'app-artist-result',
  templateUrl : './artist-result.component.html',
  styleUrls : [ './artist-result.component.scss' ]
})
export class ArtistResultComponent implements OnInit {

  @Input() artist: Artist;

  hover: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

}
