import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { PlaylistBarConfig } from '../../../../models/playlist-bar-config.interface';
import { SortType } from '../../../../enums/sort-type.enum';
import { ContentType } from '../../../../enums/content-type.enum';
import { Artist } from '../../../../models/artist.interface';
import { Album } from '../../../../models/album.interface';
import { BarConfig } from '../../../../models/bar-config.interface';
import { Position } from '../../../../models/position.interface';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';

@Component({
  selector : 'app-horizontal-chart',
  templateUrl : './horizontal-chart.component.html',
  styleUrls : [ './horizontal-chart.component.scss' ]
})
export class HorizontalChartComponent implements OnInit, OnChanges {

  @Input() bars: PlaylistBarConfig[];
  @Input() contentType: ContentType;
  @Input() topArtist: Artist;
  @Input() topAlbum: Album;
  @Input() topGenres: string[];

  sort = SortType.NONE;
  asc = false;
  sortType = SortType;
  hoveredBar: BarConfig;
  hintPosition: Position;
  hover = false;

  constructor(private _linkTileService: LinkTileService,
              private _elRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.sort = SortType.NONE;
    this.asc = false;
  }

  sortClick(): void {
    if (this.sort === SortType.NONE) {
      this.sort = SortType.MAX;
      this.asc = false;
    } else if (this.sort === SortType.MAX) {
      this.sort = SortType.MIN;
      this.asc = true;
    } else if (this.sort === SortType.MIN) {
      this.sort = SortType.NONE;
      this.asc = false;
    }

    this.sortBars();
  }

  onBarLeave(): void {
    this.hover = false;
  }

  onBarHover(bar: PlaylistBarConfig, event: MouseEvent): void {
    this.hoveredBar = this.playlistBarToBar(bar);
    this.hover = true;
    let x = event.x - 300;
    const width = this._elRef.nativeElement.getBoundingClientRect().width;
    const elRefX = this._elRef.nativeElement.getBoundingClientRect().x;
    if (x < elRefX) {
      x = event.x;
    }
    if (x + 300 - elRefX > width) {
      x = width / 2 - 150 + elRefX;
    }

    this.hintPosition = {
      x,
      y : event.y - 100
    };
  }

  onBarClick(): void {
    let config;
    if (this.hoveredBar.contentType === ContentType.album) {
      config = {
        contentType : ContentType.album,
        album : this.hoveredBar.album
      };
    } else {
      config = {
        contentType : ContentType.artist,
        artist : this.hoveredBar.artist
      };
    }

    if (this.hoveredBar.navigable) {
      this._linkTileService.updateLinkTile(config);
    }
  }

  private playlistBarToBar(bar: PlaylistBarConfig): BarConfig {
    let image;
    let navigationLabel;
    let navigable = false;
    switch (this.contentType) {
      case ContentType.artist:
        image = bar.artist.images[ 0 ];
        navigationLabel = 'Kliknij aby przejść do artysty';
        navigable = true;
        break;
      case ContentType.album:
        image = bar.album.images[ 0 ];
        navigationLabel = 'Kliknij aby przejść do albumu';
        navigable = true;
        break;
    }
    return {
      contentType : this.contentType,
      album : bar.album,
      artist : bar.artist,
      caption : bar.label,
      image,
      navigationLabel,
      navigable,
      genreArtists : bar.genreArtists
    };
  }

  private sortBars(): void {
    switch (this.sort) {
      case SortType.NONE:
        this.bars.sort((first: PlaylistBarConfig, second: PlaylistBarConfig) => this.sortByIndex(first, second));
        break;
      case SortType.MIN:
        this.bars.sort((first: PlaylistBarConfig, second: PlaylistBarConfig) => this.sortByMin(first, second));
        break;
      case SortType.MAX:
        this.bars.sort((first: PlaylistBarConfig, second: PlaylistBarConfig) => this.sortByMax(first, second));
        break;
      default:
        this.bars.sort((first: PlaylistBarConfig, second: PlaylistBarConfig) => this.sortByIndex(first, second));
    }
  }

  private sortByIndex(first: PlaylistBarConfig, second: PlaylistBarConfig): number {
    const firstCompareKey = first.index;
    const secondCompareKey = second.index;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByMin(first: PlaylistBarConfig, second: PlaylistBarConfig): number {
    const firstCompareKey = first.size;
    const secondCompareKey = second.size;

    return this.compare(firstCompareKey, secondCompareKey);
  }

  private sortByMax(first: PlaylistBarConfig, second: PlaylistBarConfig): number {
    const firstCompareKey = first.size;
    const secondCompareKey = second.size;

    return this.compare(secondCompareKey, firstCompareKey);
  }

  private compare<T>(firstCompareKey: T, secondCompareKey: T): number {
    if (firstCompareKey > secondCompareKey) {
      return 1;
    } else if (firstCompareKey < secondCompareKey) {
      return -1;
    }

    return 0;
  }

}
