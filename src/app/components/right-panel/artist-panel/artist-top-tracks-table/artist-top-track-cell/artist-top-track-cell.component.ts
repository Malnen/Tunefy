import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TrackCellComponent } from '../../../playlist-panel/track-table/track-cell/track-cell.component';
import { Item } from '../../../../../models/item.interface';
import { ContextMenuService } from '../../../../../services/context-menu/context-menu.service';
import { SpotifyService } from '../../../../../services/spotify/spotify.service';
import * as moment from 'moment';
import { SnackBarService } from '../../../../../services/snack-bar-service/snack-bar.service';
import { LinkTileService } from '../../../../../services/link-tile/link-tile.service';
import { Option } from '../../../../../models/option.interface';

@Component({
  selector : 'app-artist-top-track-cell',
  templateUrl : './artist-top-track-cell.component.html',
  styleUrls : [ './artist-top-track-cell.component.scss' ]
})
export class ArtistTopTrackCellComponent extends TrackCellComponent implements OnInit {

  @Input() item: Item;

  @Output() playTrack = new EventEmitter<number>();
  @Output() resume = new EventEmitter<void>();

  constructor(contextMenuService: ContextMenuService,
              spotifyService: SpotifyService,
              snackBarService: SnackBarService,
              linkTileService: LinkTileService) {
    super(contextMenuService, spotifyService, snackBarService, linkTileService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.removeOption();
  }

  play(): void {
    if (this.isCurrent) {
      this.resume.emit();
    } else {
      this.playTrack.emit(this.track.index);
    }
  }

  protected setTrack(): void {
    this.track = this.item;
  }

  protected setImage(): void {
    this.image = this.item.album.images[ 0 ];
  }

  protected setAddedAt(): void {
    this.addedAt = moment(this.item.album.release_date).format('YYYY-MM-DD');
  }

  private removeOption(): void {
    const option = this.options.find((o: Option) => o.label === 'Przejdź do artysty');
    const index = this.options.indexOf(option);
    this.options[ index + 1 ].showDivider = true;
    this.options.splice(index, 1);
  }

}
