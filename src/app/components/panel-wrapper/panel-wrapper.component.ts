import { Component, OnInit, ViewChild } from '@angular/core';
import { LinkTileService } from '../../services/link-tile/link-tile.service';
import { PlaylistService } from '../../services/playlist-service/playlist.service';

@Component({
  selector : 'app-panel-wrapper',
  templateUrl : './panel-wrapper.component.html',
  styleUrls : [ './panel-wrapper.component.scss' ],
  providers : [
    LinkTileService,
    PlaylistService
  ]
})
export class PanelWrapperComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


}
