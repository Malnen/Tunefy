import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base.component';
import { ContentType } from '../../enums/content-type.enum';
import { LinkTileComponent } from '../left-panel/link-tile/link-tile.component';
import { LinkTileService } from '../../services/link-tile/link-tile.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ActiveLinkConfig } from '../../models/active-link-config.interface';
import { ResizeService } from '../../services/resize-service/resize.service';

@Component({
  selector : 'app-right-panel',
  templateUrl : './right-panel.component.html',
  styleUrls : [ './right-panel.component.scss' ]
})
export class RightPanelComponent extends BaseComponent implements OnInit {

  contentTypeEnum = ContentType;
  activeLinkConfig: ActiveLinkConfig;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this._linkTileService.onLinkTileUpdate().subscribe((link: ActiveLinkConfig) => {
      this.activeLinkConfig = link;
    });
  }

}
