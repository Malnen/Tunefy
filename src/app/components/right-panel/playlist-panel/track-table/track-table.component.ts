import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PlaylistItem } from '../../../../models/playlist-item.interface';
import { ColorsEnum } from '../../../../enums/colors.enum';
import { Playlist } from '../../../../models/playlist.interface';
import { SortType } from '../../../../enums/sort-type.enum';
import * as moment from 'moment';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { Item } from '../../../../models/item.interface';
import { Playlists } from '../../../../models/playlists.interface';

@Component({
  selector : 'app-track-table',
  templateUrl : './track-table.component.html',
  styleUrls : [ './track-table.component.scss' ]
})
export class TrackTableComponent implements OnInit, OnChanges {

  @Input() tracks = [];
  @Input() loading: boolean;
  @Input() forceLoading: boolean;
  @Input() playlist: Playlist;
  @Input() playlists: Playlists;
  @Input() container: HTMLElement;

  @Output() sorted = new EventEmitter<void>();
  @Output() unfollowed = new EventEmitter<Item>();
  @Output() refresh = new EventEmitter<void>();

  isEmpty: boolean;
  spinnerColor = ColorsEnum.ORANGE;
  sortType = SortType;
  sort = SortType.NONE;
  asc = true;

  constructor(protected playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.playlistService.hasNextLoaded().subscribe(this.sortTracks.bind(this));
    this.playlistService.hasPlaylistChanged().subscribe(() => {
      this.sort = SortType.NONE;
      this.asc = true;
    });
  }

  ngOnChanges(): void {
    this.isEmpty = this.tracks?.length === 0;
  }

  onHeaderClick(sortType: SortType): void {
    switch (this.sort) {
      case sortType:
        if (this.asc) {
          this.asc = false;
        } else {
          this.asc = true;
          this.sort = SortType.NONE;
        }
        break;
      default:
        this.asc = true;
        this.sort = sortType;
    }
    this.sortTracks();
    this.sorted.emit();
  }

  onUnfollowed(track: Item): void {
    this.unfollowed.emit(track);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  protected sortTracks(): void {
    switch (this.sort) {
      case SortType.INDEX:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByIndex(first, second));
        break;
      case SortType.FOLLOW:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByFollow(first, second));
        break;
      case SortType.TRACK:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByTrack(first, second));
        break;
      case SortType.ARTIST:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByArtist(first, second));
        break;
      case SortType.ADDED_DATE:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByAddedDate(first, second));
        break;
      case SortType.DURATION:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByDuration(first, second));
        break;
      default:
        this.tracks.sort((first: PlaylistItem, second: PlaylistItem) => this.sortByIndex(first, second));
    }
  }

  private sortByIndex(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = first.index;
    const secondCompareKey = second.index;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByFollow(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = first.track.followed;
    const secondCompareKey = second.track.followed;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByTrack(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = first.track.name;
    const secondCompareKey = second.track.name;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByArtist(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = first.track.artists[ 0 ] != null ? first.track.artists[ 0 ].name : '';
    const secondCompareKey = second.track.artists[ 0 ] != null ? second.track.artists[ 0 ].name : '';

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAddedDate(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = moment(first.added_at);
    const secondCompareKey = moment(second.added_at);

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByDuration(first: PlaylistItem, second: PlaylistItem): number {
    const firstCompareKey = first.track.duration_ms;
    const secondCompareKey = second.track.duration_ms;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  protected compare<T>(firstCompareKey: T, secondCompareKey: T): number {
    if (this.asc) {
      if (firstCompareKey > secondCompareKey) {
        return 1;
      } else if (firstCompareKey < secondCompareKey) {
        return -1;
      }
    } else {
      if (firstCompareKey < secondCompareKey) {
        return 1;
      } else if (firstCompareKey > secondCompareKey) {
        return -1;
      }
    }

    return 0;
  }

}
