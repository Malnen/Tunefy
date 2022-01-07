import { Component, Input, OnInit } from '@angular/core';
import { TrackCellComponent } from '../../../../../track-table/track-cell/track-cell.component';
import { ContextMenuService } from '../../../../../../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../../../../../../services/spotify/spotify.service';
import { Album } from '../../../../../../../../models/album.interface';
import { Item } from '../../../../../../../../models/item.interface';
import * as moment from 'moment';
import { SnackBarService } from '../../../../../../../../services/snack-bar-service/snack-bar.service';
import { LinkTileService } from '../../../../../../../../services/link-tile/link-tile.service';
import { ResizeService } from '../../../../../../../../services/resize-service/resize.service';
import { DialogService } from '../../../../../../../../services/dialog/dialog.service';
import { Option } from '../../../../../../../../models/option.interface';

@Component({
  selector : 'app-album-track-cell',
  templateUrl : './album-track-cell.component.html',
  styleUrls : [ './album-track-cell.component.scss' ]
})
export class AlbumTrackCellComponent extends TrackCellComponent implements OnInit {

  @Input() album: Album;
  @Input() item: Item;

  constructor(contextMenuService: ContextMenuService,
              spotifyService: SpotifyService,
              snackBarService: SnackBarService,
              resizeService: ResizeService,
              linkTileService: LinkTileService,
              dialogService: DialogService) {
    super(contextMenuService, resizeService, dialogService, spotifyService, snackBarService, linkTileService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  play(): void {
    if (this.isCurrent) {
      this.spotifyService.play().subscribe();
    } else {
      this.spotifyService.playAlbum(this.album, this.item.index).subscribe();
    }
  }

  protected setTrack(): void {
    this.track = this.item;
  }

  protected setImage(): void {
    this.image = this.album.images[ 0 ];
  }

  protected setAddedAt(): void {
    this.addedAt = moment(this.album.release_date).format('YYYY-MM-DD');
  }

}
