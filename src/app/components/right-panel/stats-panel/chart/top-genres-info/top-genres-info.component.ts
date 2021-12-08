import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector : 'app-top-genres-info',
  templateUrl : './top-genres-info.component.html',
  styleUrls : [ './top-genres-info.component.scss' ]
})
export class TopGenresInfoComponent implements OnChanges {

  @Input() genres: Map<string, number>;

  reducedGenres: string[];

  constructor() { }

  ngOnChanges(): void {
    this.reduceGenres();
  }

  private reduceGenres(): void {
    this.reducedGenres = [];
    let genres = JSON.parse(JSON.stringify(Array.from(this.genres?.entries())));
    genres = genres?.sort((x, y) => y[ 1 ] - x [ 1 ]);
    if (genres) {
      for (const genre of genres) {
        this.reducedGenres.push(genre[ 0 ]);
        if (this.reducedGenres.length > 4) {
          break;
        }
      }
    }
  }

}
