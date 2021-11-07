import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { Playlist } from '../../../models/playlist.interface';
import { Image } from '../../../models/image.interface';
import { PlaylistTracks } from '../../../models/playlist-tracks.interface';
import { Player } from '../../../models/player.interface';
import { Context } from '../../../models/context.interface';
import { PlaylistItem } from '../../../models/playlist-item.interface';
import { PlaylistService } from '../../../services/playlist-service/playlist.service';
import { Observable } from 'rxjs';

@Component({
  selector : 'app-playlist-panel',
  templateUrl : './playlist-panel.component.html',
  styleUrls : [ './playlist-panel.component.scss' ]
})
export class PlaylistPanelComponent implements OnInit, OnChanges {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() playlist: Playlist;
  @Input() container: HTMLElement;

  playlistTracks: PlaylistTracks;
  image: Image;
  hasImage = true;
  player: Player;
  isCurrent: boolean;
  isPlaying: boolean;
  loading: boolean;
  context: Context;
  searchValue: string;
  tracksToRender = [];
  forceLoading: boolean;

  protected disabledItemsCount = 0;
  private _scrollPosition: number;
  private _timer: any;
  private _loadAll: boolean;

  constructor(protected spotifyService: SpotifyService,
              protected playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.setContext();
    this.loadPanel();
    this.container.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnChanges(): void {
    this.loadPanel();
    this.playlistService.updatePlaylistChanged();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  play(): void {
    if (this.isPlaying) {
      this.spotifyService.pause().subscribe();
    } else {
      if (this.isCurrent) {
        this.spotifyService.forcePlay().subscribe();
      } else {
        this.getPlayObservable().subscribe();
      }
    }
  }

  playRandom(): void {
    this.spotifyService.setShuffleState(true).subscribe(() => {
      const offset = Math.floor(Math.random() * (this.playlist.tracks.total + 1));
      this.spotifyService.playPlaylist(this.playlist, offset).subscribe();
    });
  }

  onInputChange(): void {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.loadAll();
      this.filter();
    }, 500);
  }

  clearSearchValue(): void {
    this.searchInput.nativeElement.value = '';
    this.filter();
  }

  onSorted(): void {
    this.forceLoading = true;
    this.loadAll();
  }

  protected setContext(): void {
    this.context = { uri : this.playlist.uri };
  }

  protected getLoadTracksObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getTracks(this.playlist.id);
  }

  protected getLoadNextObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getTracks(this.playlist.id, this.playlistTracks.next);
  }

  protected getPlayObservable(): Observable<any> {
    return this.spotifyService.playPlaylist(this.playlist);
  }

  protected listenToPlayer(): void {
    this.spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.isCurrent = this.player?.context?.uri === this.playlist?.uri;
      this.isPlaying = this.player?.is_playing && this.isCurrent;
    });
  }

  protected checkMarkets(playlistTracks: PlaylistTracks, length?: number): void {
    const items = playlistTracks.items;
    let index = length != null ? length - this.disabledItemsCount : 0;
    for (const item of items) {
      item.track.disabled = item.track.restrictions != null;
      item.index = index;
      index++;
    }
  }

  protected loadTracks(): void {
    this.getLoadTracksObservable().subscribe((playlistTracks: PlaylistTracks) => {
      this.checkMarkets(playlistTracks);
      this.playlistTracks = playlistTracks;
      this.playlist.tracks.total = playlistTracks.total;
      this.loading = false;
      this.checkFollows();
      this.filter();
    });
  }

  protected checkFollows(playlistTracks?: PlaylistTracks, length?: number): void {
    const chunk = 50;
    const tracks = playlistTracks ?? this.playlistTracks;
    const offset = length ?? 0;
    const items = tracks.items;
    for (let i = 0; i < items.length; i += chunk) {
      const temp = items.slice(i, i + chunk);
      this.spotifyService.checkIfTrackAreFollowed(temp).subscribe((response: boolean[]) => {
        for (let j = 0; j < response.length - 1; j++) {
          this.playlistTracks.items[ i + j + offset ].track.followed = response[ j ];
        }
      });
    }
  }

  protected filter(): void {
    this.searchValue = this.searchInput.nativeElement.value;
    const hasSearchValue = this.searchValue.length > 0;
    if (hasSearchValue) {
      this.tracksToRender = [];
    }
    this.tracksToRender = this.playlistTracks.items.filter((item: PlaylistItem) => {
      if (hasSearchValue) {
        const searchValue = this.searchValue.toLocaleLowerCase();
        const includesName = item.track.name.toLocaleLowerCase().includes(searchValue);
        let includesArtist = false;
        for (const artist of item.track.artists) {
          if (artist.name.toLocaleLowerCase().includes(searchValue)) {
            includesArtist = true;
            break;
          }
        }
        return includesName || includesArtist;
      }

      return true;
    })
    ;
  }

  protected loadImage(): void {
    if (this.playlist?.images.length > 0) {
      this.hasImage = true;
      this.image = this.playlist.images[ 0 ];
    } else {
      this.hasImage = false;
    }
  }

  private onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this._scrollPosition = target ? target.scrollTop / (target.scrollHeight - target.clientHeight) : 0;
    if (this._scrollPosition > 0.8 && !this.loading) {
      this.loadNext();
    }
  }

  private loadPanel(): void {
    this.disabledItemsCount = 0;
    this.loading = true;
    this.playlistTracks = null;
    this.scrollToTop();
    this.loadImage();
    this.loadTracks();
    this.listenToPlayer();
  }

  private scrollToTop(): void {
    if (this.container) {
      this.container.scrollTo({
        top : 0,
        left : 0,
        behavior : 'smooth'
      });
    }
  }

  private loadNext(): void {
    if (this.playlistTracks?.next != null) {
      this.loading = true;
      this.getLoadNextObservable().subscribe((playlistTracks: PlaylistTracks) => {
        const length = this.playlistTracks.items.length;
        this.checkMarkets(playlistTracks, length);
        this.playlistTracks.next = playlistTracks.next;
        this.playlistTracks.items.push(...playlistTracks.items);
        this.loading = false;
        setTimeout(() => {
          if (this._scrollPosition > 0.8 || this._loadAll) {
            setTimeout(this.loadNext.bind(this), 100);
          }
        }, 0);
        this.checkFollows(playlistTracks, length);
        this.filter();
      });
    } else {
      this.playlistService.updateNextLoaded();
      this.forceLoading = false;
    }
  }

  private loadAll(): void {
    this._loadAll = true;
    this.loadNext();
  }

}
