import { Component, OnInit, ViewChild } from '@angular/core';
import { LinkTileService } from '../../services/link-tile/link-tile.service';
import { PlaylistService } from '../../services/playlist-service/playlist.service';
import { BaseComponent } from '../base-component/base.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ResizeService } from '../../services/resize-service/resize.service';

@Component({
  selector : 'app-panel-wrapper',
  templateUrl : './panel-wrapper.component.html',
  styleUrls : [ './panel-wrapper.component.scss' ],
  providers : [
    LinkTileService
  ]
})
export class PanelWrapperComponent extends BaseComponent implements OnInit {

  leftPanelOpened = false;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onLeftPanelOpenEvent(event: boolean): void {
    this.leftPanelOpened = event;
  }

}
