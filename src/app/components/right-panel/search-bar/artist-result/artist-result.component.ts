import { Component, Input, OnInit } from '@angular/core';
import { Artist } from '../../../../models/artist.interface';
import { HoverableComponent } from '../../../hoverable/hoverable.component';

@Component({
  selector : 'app-artist-result',
  templateUrl : './artist-result.component.html',
  styleUrls : [ './artist-result.component.scss' ]
})
export class ArtistResultComponent extends HoverableComponent implements OnInit {

  @Input() artist: Artist;

  constructor() {super(); }

  ngOnInit(): void {
  }

}
