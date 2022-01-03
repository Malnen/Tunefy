import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {PlaylistBarConfig} from '../../../../models/playlist-bar-config.interface';
import {SortType} from '../../../../enums/sort-type.enum';
import {ContentType} from '../../../../enums/content-type.enum';

@Component({
  selector: 'app-horizontal-chart',
  templateUrl: './horizontal-chart.component.html',
  styleUrls: ['./horizontal-chart.component.scss']
})
export class HorizontalChartComponent implements OnInit, OnChanges {

  @Input() bars: PlaylistBarConfig[];
  @Input() contentType: ContentType;

  sort = SortType.NONE;
  asc = false;
  sortType = SortType;

  constructor() {
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
