import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SpotifyService} from '../../../services/spotify/spotify.service';
import {Playlist} from '../../../models/playlist.interface';
import {Image} from '../../../models/image.interface';
import {PlaylistTracks} from '../../../models/playlist-tracks.interface';
import {Player} from '../../../models/player.interface';
import {Context} from '../../../models/context.interface';
import {PlaylistItem} from '../../../models/playlist-item.interface';
import {PlaylistService} from '../../../services/playlist-service/playlist.service';
import {Observable} from 'rxjs';
import {Item} from '../../../models/item.interface';
import {Playlists} from '../../../models/playlists.interface';
import {DialogService} from '../../../services/dialog/dialog.service';
import {HoverableComponent} from '../../hoverable/hoverable.component';
import {BaseComponent} from '../../base-component/base.component';
import {ContextMenuService} from '../../../services/context-menu/context-menu.service';
import {ResizeService} from '../../../services/resize-service/resize.service';
import {Switch} from '../../../models/switch.interface';
import {ContentType} from '../../../enums/content-type.enum';
import {ColorsEnum} from '../../../enums/colors.enum';
import {Artist} from '../../../models/artist.interface';
import {Album} from '../../../models/album.interface';
import {Artists} from '../../../models/artists.interface';
import {PlaylistBarConfig} from '../../../models/playlist-bar-config.interface';

@Component({
  selector: 'app-playlist-panel',
  templateUrl: './playlist-panel.component.html',
  styleUrls: ['./playlist-panel.component.scss']
})
export class PlaylistPanelComponent extends BaseComponent implements OnInit, OnChanges {

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
  playlists: Playlists;
  isUserPlaylist = true;
  switches: Switch[];
  switchValue: any;
  statsSwitches: Switch[];
  statsSwitchValue: any;
  isStatsPanel = false;
  statsLoaded = false;
  spinnerColor = ColorsEnum.ORANGE;
  noData = false;
  activeBarsConfig: PlaylistBarConfig[];

  protected disabledItemsCount = 0;
  private _scrollPosition: number;
  private _timer: any;
  private _loadAll: boolean;
  private _listUsedNext = [];
  private _artists: Artist[];
  private _albums: Album[];
  private _genres: string[];
  private _artistsBars: PlaylistBarConfig[];
  private _albumsBars: PlaylistBarConfig[];
  private _genresBars: PlaylistBarConfig[];

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              protected spotifyService: SpotifyService,
              protected playlistService: PlaylistService,
              private _dialogService: DialogService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initSwitches();
    this.setContext();
    this.loadPanel();
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    this.playlistService.hasPlaylistsUpdated().subscribe((playlists: Playlists) => {
      this.playlists = playlists;
      const playlist = this.playlists.items.find(value => value.id === this.playlist.id);
      if (playlist) {
        this.playlist = playlist;
        this.loadImage();
      }
    });
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
        this.spotifyService.setShuffleState(false).subscribe();
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

  onRefresh(): void {
    this.ngOnChanges();
  }

  onUnfollowed(track: Item): void {
  }

  onDetailsClick(): void {
    this._dialogService.openEditPlaylistDialog(this.playlist);
  }

  onChangeImageClick(): void {
    this._dialogService.openChangePlaylistImageDialog(this.playlist);
  }

  switch(switcher: Switch): void {
    this.isStatsPanel = switcher.value === ContentType.stats;
    this.switchValue = switcher.value;
    const allLoaded = this.statsLoaded && !this.loading && this.playlistTracks.next == null;
    if (!allLoaded) {
      this.loadAll();
    }
  }

  statsSwitch(switcher: Switch): void {
    switch (switcher.value) {
      case ContentType.artist:
        this.activeBarsConfig = this._artistsBars;
        break;
      case ContentType.album:
        this.activeBarsConfig = this._albumsBars;
        break;
      case ContentType.genres:
        this.activeBarsConfig = this._genresBars;
        break;
    }
  }

  protected setContext(): void {
    this.context = {uri: this.playlist.uri};
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
          this.playlistTracks.items[i + j + offset].track.followed = response[j];
        }
      });
    }
  }

  protected filter(): void {
    this.searchValue = this.searchInput?.nativeElement.value;
    const hasSearchValue = this.searchValue?.length > 0;
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
      this.image = this.playlist.images[0];
    } else {
      this.hasImage = false;
    }
  }

  protected loadAll(): void {
    this._loadAll = true;
    this.loadNext();
  }

  protected afterLoad(): void {

  }

  private initSwitches(): void {
    this.switchValue = ContentType.playlist;
    this.statsSwitchValue = ContentType.artist;
    this.switches = [
      {
        name: 'Playlista',
        icon: '',
        value: ContentType.playlist
      },
      {
        name: 'Statystyki',
        icon: '',
        value: ContentType.stats
      }
    ];
    this.statsSwitches = [
      {
        name: 'Artyści',
        icon: '',
        value: ContentType.artist
      },
      {
        name: 'Albumy',
        icon: '',
        value: ContentType.album
      },
      {
        name: 'Gatunki',
        icon: '',
        value: ContentType.genres
      }
    ];
  }

  private onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this._scrollPosition = target ? target.scrollTop / (target.scrollHeight - target.clientHeight) : 0;
    if (this._scrollPosition > 0.8 && !this.loading) {
      this.loadNext();
    }
  }

  private loadPanel(): void {
    this.isStatsPanel = false;
    this.statsLoaded = false;
    this.activeBarsConfig = this._artistsBars;
    this.switchValue = ContentType.playlist;
    this.statsSwitchValue = ContentType.artist;
    this.disabledItemsCount = 0;
    this.loading = true;
    this.playlistTracks = null;
    this._listUsedNext = [];
    this.scrollToTop();
    this.loadImage();
    this.loadTracks();
    this.listenToPlayer();
    this.isUserPlaylist = this.playlist?.type === 'playlist' && this.playlist?.owner.uri !== 'spotify:user:spotify';
  }

  private scrollToTop(): void {
    if (this.container) {
      this.container.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  private loadNext(): void {
    const next = this.playlistTracks?.next;
    if (next != null) {
      if (this._listUsedNext.includes(next)) {
        return;
      }
      this._listUsedNext.push(next);
      this.loading = true;
      this.getLoadNextObservable().subscribe((playlistTracks: PlaylistTracks) => {
        const length = this.playlistTracks.items.length;
        this.checkMarkets(playlistTracks, length);
        this.playlistTracks.next = playlistTracks.next;
        this.playlistTracks.items.push(...playlistTracks.items);
        this.loading = false;
        setTimeout(() => {
          if (this._scrollPosition > 0.8 || this._loadAll) {
            setTimeout(this.loadNext.bind(this), 500);
          }
        }, 0);
        this.checkFollows(playlistTracks, length);
        this.filter();
        this.afterLoad();
      });
    } else {
      this.playlistService.updateNextLoaded();
      this.forceLoading = false;
      this.setStats();
    }
  }

  private setStats(): void {
    if (this.statsLoaded) {
      return;
    }

    this.loadArtists();
  }

  private loadArtists(): void {
    this._artists = [];
    if (this.playlistTracks.items.length < 1) {
      this.noData = true;
      this.statsLoaded = true;
    } else {
      this.noData = false;
      const artistsMap = new Map<string, number>();
      for (const track of this.playlistTracks.items) {
        const artists = track.track.artists;
        for (const artist of artists) {
          const id = artist.id;
          if (artistsMap.has(id)) {
            const value = artistsMap.get(id);
            artistsMap.set(id, value + 1);
          } else {
            artistsMap.set(id, 1);
          }
        }
      }

      const ids = Array.from(artistsMap.keys());
      const slices = this.getSlices(50, ids);
      const iterator = slices[Symbol.iterator]();
      const next = iterator.next().value;
      this.spotifyService.getArtists(next).subscribe((artists: Artists) => {
        this._artists.push(...artists.artists);
        this.loadNextArtists(iterator);
      });
    }
  }

  private loadNextArtists(iterator: any): void {
    const next = iterator.next.value;
    if (next != null) {
      this.spotifyService.getArtists(next).subscribe((artists: Artists) => {
        this._artists.push(...artists.artists);
        this.loadNextArtists(iterator);
      });
    } else {
      this.setArtistsBars();
      this.loadAlbums();
    }
  }

  private setArtistsBars(): void {
    this._artistsBars = [];
    const artistsMap = new Map<Artist, number>();
    for (const track of this.playlistTracks.items) {
      const artists = track.track.artists;
      for (const artist of artists) {
        const fullArtist = this._artists.find(value => value.id === artist.id);
        if (artistsMap.has(fullArtist)) {
          const value = artistsMap.get(fullArtist);
          artistsMap.set(fullArtist, value + 1);
        } else {
          artistsMap.set(fullArtist, 1);
        }
      }
    }

    const artistsArray = Array.from(artistsMap);
    const max = Math.max(...artistsArray.map(value => value[1]));
    const step = 90 / max;
    for (const artist of artistsArray) {
      this._artistsBars.push({
        label: artist[0]?.name,
        size: artist[1],
        step
      });
    }

    this.activeBarsConfig = this._artistsBars;
  }

  private loadAlbums(): void {
    this._albums = [];
    const albums = new Map<string, { album: Album, value: number }>();
    for (const track of this.playlistTracks.items) {
      const album = track.track.album;
      const id = album.id;
      if (albums.has(id)) {
        const entry = albums.get(id);
        albums.set(id, {album, value: entry.value + 1});
      } else {
        albums.set(id, {album, value: 1});
      }
    }

    this._albums = Array.from(albums.values()).map(value => value.album);
    this.setAlbumBars(albums);
    this.setGenres();
  }

  private setAlbumBars(albums: Map<string, { album: Album, value: number }>): void {
    this._albumsBars = [];
    const albumsArray = Array.from(albums);
    const max = Math.max(...albumsArray.map(value => value[1].value));
    const step = 90 / max;
    for (const album of albumsArray) {
      this._albumsBars.push({
        label: album[1].album.name,
        size: album[1].value,
        step
      });
    }
  }

  private setGenres(): void {
    this._genres = [];
    const genres = new Map<string, number>();
    for (const artist of this._artists) {
      const artistGenres = artist.genres;
      for (const genre of artistGenres) {
        if (genres.has(genre)) {
          const value = genres.get(genre);
          genres.set(genre, value + 1);
        } else {
          genres.set(genre, 1);
        }
      }
    }

    this._genres = Array.from(genres.keys());
    this.setGenresBars(genres);
    this.statsLoaded = true;
  }

  private setGenresBars(genres: Map<string, number>): void {
    this._genresBars = [];
    const genresArray = Array.from(genres);
    const max = Math.max(...genresArray.map(value => value[1]));
    const step = 90 / max;
    for (const genre of genresArray) {
      this._genresBars.push({
        label: genre[0],
        size: genre[1],
        step
      });
    }
  }

  private getSlices(size: number, array: any[]): any[] {
    const slices = [];
    let index = 0;
    while (index < array.length) {
      const slice = array.slice(index, size + index);
      slices.push(slice);
      index = size + index;
    }

    return slices;
  }

}
