import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { RecentlyPlayed } from '../../../models/recently-played.interface';
import { Player } from '../../../models/player.interface';
import { ColorsEnum } from '../../../enums/colors.enum';
import { Artist } from '../../../models/artist.interface';
import { Artists } from '../../../models/artists.interface';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';
import { RecentlyPlayedItem } from '../../../models/recently-played-item.interface';

@Component({
  selector : 'app-home-panel',
  templateUrl : './home-panel.component.html',
  styleUrls : [ './home-panel.component.scss' ]
})
export class HomePanelComponent implements OnInit {

  @ViewChild('tracksWrapper') tracksWrapper: ElementRef;
  @ViewChild('artistsWrapper') artistsWrapper: ElementRef;

  recentlyPlayed: RecentlyPlayed;
  openTracks: boolean;
  openArtists: boolean;
  showMoreTracksButton: boolean;
  showMoreArtistsButton: boolean;
  tracksHeight: number;
  artistsHeight: number;
  loading = true;
  spinnerColor = ColorsEnum.ORANGE;
  artists: Artist[];

  private readonly DEFAULT_HEIGHT = 550;

  private _lastTrack: string;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.tracksHeight = this.DEFAULT_HEIGHT;
    this.artistsHeight = this.DEFAULT_HEIGHT;

    this.updateRecentlyPlayed();
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      if (this._lastTrack !== player?.item?.id) {
        this._lastTrack = player?.item?.id;
        this.updateRecentlyPlayed();
      }
    });
  }

  onShowMoreTracksClick(): void {
    this.openTracks = !this.openTracks;
    if (this.openTracks) {
      this.tracksHeight = this.tracksWrapper.nativeElement.offsetHeight * 10;
    } else {
      this.tracksHeight = 600;
    }
  }

  onShowMoreArtistsClick(): void {
    this.openArtists = !this.openArtists;
    if (this.openArtists) {
      this.artistsHeight = this.artistsWrapper.nativeElement.offsetHeight * 10;
    } else {
      this.artistsHeight = 600;
    }
  }

  private updateRecentlyPlayed(): void {
    this._spotifyService.getRecentlyPlayed().subscribe((recentlyPlayed: RecentlyPlayed) => {
      this.recentlyPlayed = this.filterRecentlyPlayed(recentlyPlayed);
      this.setArtists();
      this.loading = false;
      setTimeout(() => {
        const tracksHeight = this.tracksWrapper?.nativeElement.offsetHeight;
        const artistsHeight = this.artistsWrapper?.nativeElement.offsetHeight;
        this.showMoreTracksButton = tracksHeight > this.DEFAULT_HEIGHT;
        this.showMoreArtistsButton = artistsHeight > this.DEFAULT_HEIGHT;
      }, 0);
    });
  }

  private filterRecentlyPlayed(recentlyPlayed: RecentlyPlayed): RecentlyPlayed {
    const items = recentlyPlayed.items;
    const resultMap = new Map();
    for (const item of items) {
      resultMap.set(item.track.id, item);
    }
    return { items : Array.from(resultMap.values()) } as RecentlyPlayed;
  }

  private setArtists(): void {
    const artists = new Map();
    for (const recentlyPlayed of this.recentlyPlayed.items) {
      for (const artist of recentlyPlayed.track.artists) {
        artists.set(artist.id, artist.id);
      }
    }

    this._spotifyService.getArtists(Array.from(artists.values())).subscribe((result: Artists) => {
      this.artists = result.artists;
      this.loading = false;
    });
  }

}
