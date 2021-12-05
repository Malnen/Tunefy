import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { RecentlyPlayed } from '../../../../models/recently-played.interface';
import { ContentType } from '../../../../enums/content-type.enum';
import { BarConfig } from '../../../../models/bar-config.interface';
import { Artist } from '../../../../models/artist.interface';
import { Album } from '../../../../models/album.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Artists } from '../../../../models/artists.interface';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DateRange } from '../../../../models/date-range.interface';
import { Position } from '../../../../models/position.interface';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';

@Component({
  selector : 'app-chart',
  templateUrl : './chart.component.html',
  styleUrls : [ './chart.component.scss' ]
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() recentlyPlayed: RecentlyPlayed;
  @Input() contentType: ContentType;

  @Output() refresh = new EventEmitter<DateRange>();

  bars: BarConfig[];
  hasData = false;
  barStep = 90;
  topBar: BarConfig;
  contentTypeEnum = ContentType;
  topArtist: Artist;
  topAlbum: Album;
  genres: string[];
  hoveredBar: BarConfig;
  hintPosition: Position;
  hover = false;

  private readonly BASE_BAR_STEP = 90;

  private _max: number;
  private _startMillis: number;
  private _endMillis: number;

  constructor(private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.bars = [];
    if (this.recentlyPlayed.items.length > 0) {
      this.setBars();
    }
  }

  onStartDateChange(date: MatDatepickerInputEvent<Date>): void {
    this._startMillis = moment(date.value).valueOf();
  }

  onEndDateChange(date: MatDatepickerInputEvent<Date>): void {
    this._endMillis = moment(date.value).valueOf();
  }

  onClose(): void {
    const isValid = !isNaN(this._startMillis) && !isNaN(this._endMillis);
    if (isValid) {
      this.refresh.emit({
        start : this._startMillis,
        end : this._endMillis
      });
    }
  }

  onBarLeave(): void {
    this.hover = false;
  }

  onBarHover(bar: BarConfig, event: MouseEvent): void {
    this.hoveredBar = bar;
    this.hover = true;
    this.hintPosition = {
      x : event.x - 300,
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

  private setBars(): void {
    switch (this.contentType) {
      case ContentType.artist:
        this.setArtists();
        break;
      case ContentType.album:
        this.setAlbums();
        break;
      case ContentType.genres:
        this.setGenres();
        break;
    }
  }

  private setArtists(): void {
    const artists = new Map<string, { obj: Artist, count: number }>();
    const ids = [];
    for (const item of this.recentlyPlayed.items) {
      for (const artist of item.track.artists) {
        const name = artist.name;
        if (!ids.includes(artist.id)) {
          ids.push(artist.id);
        }
        if (artists.has(name)) {
          const value = artists.get(name).count + 1;
          artists.set(name, { obj : artist, count : value });
        } else {
          artists.set(name, { obj : artist, count : 1 });
        }
      }
    }

    this._spotifyService.getArtists(ids).subscribe((response: Artists) => {
      this.topArtist = response.artists[ 0 ];
      for (const artist of response.artists) {
        const bar = this.bars.find(value => value.caption === artist.name);
        bar.image = artist.images[ 0 ];
        bar.artist = artist;
      }
    });
    this.fillBars(artists);
    const topArtist = Array.from(artists.values()).find(value => value.count === this._max).obj;
    this._spotifyService.getArtists([ topArtist.id ]).subscribe((response: Artists) => {
      this.topArtist = response.artists[ 0 ];
      for (const artist of artists.values()) {
        artist.obj = response.artists.find(value => value.id === artist.obj.id);
      }
    });
  }

  private setAlbums(): void {
    const albums = new Map<string, { obj: Album, count: number }>();
    for (const item of this.recentlyPlayed.items) {
      const album = item.track.album;
      const name = item.track.album.name;
      if (albums.has(name)) {
        const value = albums.get(name).count + 1;
        albums.set(name, { obj : album, count : value });
      } else {
        albums.set(name, { obj : album, count : 1 });
      }
    }
    this.fillBars(albums);
    this.topAlbum = Array.from(albums.values()).find(value => value.count === this._max).obj;
  }

  private setGenres(): void {
    const ids = [];
    for (const item of this.recentlyPlayed.items) {
      for (const artist of item.track.artists) {
        if (!ids.includes(artist.id)) {
          ids.push(artist.id);
        }
      }
    }

    this._spotifyService.getArtists(ids).subscribe((artists: Artists) => {
      const genres = new Map<string, number>();
      for (const artist of artists.artists) {
        if (artist.genres != null) {
          for (const genre of artist.genres) {
            if (genres.has(genre)) {
              const value = genres.get(genre) + 1;
              genres.set(genre, value);
            } else {
              genres.set(genre, 1);
            }
          }
        }
      }

      this.fillBarsWithGenres(genres, artists);
      this.genres = Array.from(genres.keys());
    });
  }

  private fillBars(obj: Map<string, { obj: Artist | Album, count: number }>): void {
    const values = this.extractValues(obj);
    this._max = this.getMax(values);
    this.barStep = this.BASE_BAR_STEP / this._max;
    for (const value of obj.values()) {
      const isAlbum = value.obj.href.includes('album');
      this.bars.push({
        caption : value.obj.name,
        size : value.count,
        image : value.obj.images != null ? value.obj.images[ 0 ] : null,
        height : this.barStep * value.count,
        width : 100 / values.length,
        navigable : true,
        navigationLabel : 'Kliknij aby przejść do ' + (isAlbum ? 'albumu' : 'artysty'),
        contentType : isAlbum ? ContentType.album : ContentType.artist,
        artist : isAlbum ? null : value.obj as Artist,
        album : isAlbum ? value.obj as Album : null
      });
    }
  }

  private fillBarsWithGenres(genres: Map<string, number>, artists: Artists): void {
    const values = Array.from(genres.values());
    this._max = this.getMax(values);
    this.barStep = this.BASE_BAR_STEP / this._max;
    for (const value of genres[ Symbol.iterator ]()) {
      const genreArtists = [];
      for (const artist of artists.artists) {
        if (genreArtists.length < 5) {
          if (artist.genres.includes(value[ 0 ])) {
            genreArtists.push(artist);
          }
        } else {
          break;
        }
      }

      this.bars.push({
        caption : value[ 0 ],
        size : value[ 1 ],
        height : this.barStep * value[ 1 ],
        width : 100 / values.length,
        navigable : false,
        genreArtists,
        contentType : ContentType.genres
      });
    }
  }

  private extractValues(source: Map<string, { obj: Album | Artist, count: number }>): number[] {
    return Array.from(source.values()).map(value => value.count);
  }

  private getMax(values: number[]): number {
    return Math.max(...values);
  }

}
