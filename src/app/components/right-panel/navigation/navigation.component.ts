import { Component, OnInit } from '@angular/core';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';

@Component({
  selector : 'app-navigation',
  templateUrl : './navigation.component.html',
  styleUrls : [ './navigation.component.scss' ]
})
export class NavigationComponent implements OnInit {

  hasNext: boolean;
  hasPrevious: boolean;

  constructor(private _linkService: LinkTileService) { }

  ngOnInit(): void {
    this._linkService.onHasNextUpdate().subscribe((hasNext: boolean) => this.hasNext = hasNext);
    this._linkService.onHasPreviousUpdate().subscribe((hasPrevious: boolean) => this.hasPrevious = hasPrevious);
  }

  previous(): void {
    this._linkService.previous();
  }

  next(): void {
    this._linkService.next();
  }

}
