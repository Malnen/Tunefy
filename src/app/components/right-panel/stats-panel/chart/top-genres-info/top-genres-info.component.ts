import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector : 'app-top-genres-info',
  templateUrl : './top-genres-info.component.html',
  styleUrls : [ './top-genres-info.component.scss' ]
})
export class TopGenresInfoComponent implements OnChanges {

  @Input() genres: string[];

  reducedGenres: string[];

  constructor() { }

  ngOnChanges(): void {
    this.reduceGenres();
  }

  private reduceGenres(): void {
    this.reducedGenres = [];
    if (this.genres) {
      for (const genre of this.genres) {
        this.reducedGenres.push(genre);
        if (this.reducedGenres.length > 4) {
          break;
        }
      }
    }
  }

}
