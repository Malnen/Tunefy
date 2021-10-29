import { Component, Input, OnInit } from '@angular/core';
import { TrackTableComponent } from '../../../track-table/track-table.component';
import { PlaylistService } from '../../../../../../services/playlist-service/playlist.service';
import { Album } from '../../../../../../models/album.interface';
import { SortType } from '../../../../../../enums/sort-type.enum';
import { Item } from '../../../../../../models/item.interface';

@Component({
  selector : 'app-album-table',
  templateUrl : './album-table.component.html',
  styleUrls : [ './album-table.component.scss' ]
})
export class AlbumTableComponent extends TrackTableComponent implements OnInit {

  @Input() album: Album;

  constructor(playlistService: PlaylistService) {
    super(playlistService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected sortTracks(): void {
    switch (this.sort) {
      case SortType.INDEX:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumIndex(first, second));
        break;
      case SortType.FOLLOW:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumFollow(first, second));
        break;
      case SortType.TRACK:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumTrack(first, second));
        break;
      case SortType.ARTIST:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumArtist(first, second));
        break;
      case SortType.ADDED_DATE:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumIndex(first, second));
        break;
      case SortType.DURATION:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumDuration(first, second));
        break;
      default:
        this.tracks.sort((first: Item, second: Item) => this.sortByAlbumIndex(first, second));
    }
  }

  private sortByAlbumIndex(first: Item, second: Item): number {
    const firstCompareKey = first.index;
    const secondCompareKey = second.index;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAlbumFollow(first: Item, second: Item): number {
    const firstCompareKey = first.followed;
    const secondCompareKey = second.followed;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAlbumTrack(first: Item, second: Item): number {
    const firstCompareKey = first.name;
    const secondCompareKey = second.name;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAlbumArtist(first: Item, second: Item): number {
    const firstCompareKey = first.artists[ 0 ] != null ? first.artists[ 0 ].name : '';
    const secondCompareKey = second.artists[ 0 ] != null ? second.artists[ 0 ].name : '';

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAlbumDuration(first: Item, second: Item): number {
    const firstCompareKey = first.duration_ms;
    const secondCompareKey = second.duration_ms;

    return this.compare(firstCompareKey, secondCompareKey);
  }

}
