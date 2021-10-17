import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base.component';
import { ContentType } from '../../enums/content-type.enum';
import { LinkTileComponent } from '../left-panel/link-tile/link-tile.component';
import { LinkTileService } from '../../services/link-tile.service';

@Component({
  selector : 'app-right-panel',
  templateUrl : './right-panel.component.html',
  styleUrls : [ './right-panel.component.scss' ]
})
export class RightPanelComponent extends BaseComponent implements OnInit {

  contentTypeEnum = ContentType;
  activeLinkTile: LinkTileComponent;

  constructor(private _linkTileService: LinkTileService) {
    super();
  }

  ngOnInit(): void {
    this._linkTileService.onLinkTileUpdate().subscribe((link: LinkTileComponent) => {
      this.activeLinkTile = link;
    });
  }

}
