import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TrackTableComponent } from '../../playlist-panel/track-table/track-table.component';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { SortType } from '../../../../enums/sort-type.enum';
import { Item } from '../../../../models/item.interface';
import { ArtistTopTracks } from '../../../../models/artist-top-tracks.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';

@Component({
  selector : 'app-artist-top-tracks-table',
  templateUrl : './artist-top-tracks-table.component.html',
  styleUrls : [ './artist-top-tracks-table.component.scss' ]
})
export class ArtistTopTracksTableComponent extends TrackTableComponent implements OnInit, OnChanges {

  @Input() topTracks: ArtistTopTracks;

  constructor(playlistService: PlaylistService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService) {
    super(playlistService, resizeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setIndexes();
  }

  ngOnChanges(): void {
    this.isEmpty = this.topTracks?.tracks?.length === 0;
    this.setIndexes();
  }

  play(index: number): void {
    const uris = this.getUris();
    this._spotifyService.playFromUris(uris, index).subscribe();
  }

  resume(): void {
    this._spotifyService.play().subscribe();
  }

  protected sortTracks(): void {
    switch (this.sort) {
      case SortType.INDEX:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByTrackIndex(first, second));
        break;
      case SortType.FOLLOW:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByTrackFollow(first, second));
        break;
      case SortType.TRACK:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByTopTrack(first, second));
        break;
      case SortType.ALBUM:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByAlbum(first, second));
        break;
      case SortType.ADDED_DATE:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByReleaseDate(first, second));
        break;
      case SortType.DURATION:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByTrackDuration(first, second));
        break;
      default:
        this.topTracks?.tracks.sort((first: Item, second: Item) => this.sortByTrackIndex(first, second));
    }
  }

  private setIndexes(): void {
    if (this.topTracks == null) {
      return;
    }

    for (let i = 0; i < this.topTracks.tracks.length; i++) {
      this.topTracks.tracks[ i ].index = i;
    }
  }

  private getUris(): string[] {
    return this.topTracks.tracks.map((track: Item) => track.uri);
  }

  private sortByTrackIndex(first: Item, second: Item): number {
    const firstCompareKey = first.index;
    const secondCompareKey = second.index;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByTrackFollow(first: Item, second: Item): number {
    const firstCompareKey = first.followed;
    const secondCompareKey = second.followed;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByTopTrack(first: Item, second: Item): number {
    const firstCompareKey = first.name;
    const secondCompareKey = second.name;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByAlbum(first: Item, second: Item): number {
    const firstCompareKey = first.album?.name ?? '';
    const secondCompareKey = second.album?.name ?? '';

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByReleaseDate(first: Item, second: Item): number {
    const firstCompareKey = first.album?.release_date ?? '';
    const secondCompareKey = second.album?.release_date ?? '';

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByTrackDuration(first: Item, second: Item): number {
    const firstCompareKey = first.duration_ms;
    const secondCompareKey = second.duration_ms;

    return this.compare(firstCompareKey, secondCompareKey);
  }

}
