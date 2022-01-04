import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { RecentlyPlayed } from '../../../models/recently-played.interface';
import { Item } from '../../../models/item.interface';
import { ColorsEnum } from '../../../enums/colors.enum';
import { BaseComponent } from '../../base-component/base.component';
import { ContextMenuService } from '../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../services/resize-service/resize.service';
import { Image } from '../../../models/image.interface';
import { DiscoverService } from '../../../services/discover/discover.service';
import { PlaylistService } from '../../../services/playlist-service/playlist.service';
import { Playlists } from '../../../models/playlists.interface';
import { Playlist } from '../../../models/playlist.interface';
import { SnackBarService } from '../../../services/snack-bar-service/snack-bar.service';
import { LinkTileService } from '../../../services/link-tile/link-tile.service';
import { Artist } from '../../../models/artist.interface';
import { Artists } from '../../../models/artists.interface';
import { ContentType } from '../../../enums/content-type.enum';
import { Player } from '../../../models/player.interface';

@Component({
  selector : 'app-discover-panel',
  templateUrl : './discover-panel.component.html',
  styleUrls : [ './discover-panel.component.scss' ]
})
export class DiscoverPanelComponent extends BaseComponent implements OnInit {

  @Input() container: HTMLElement;

  hintOpened = false;
  loading: boolean;
  recentlyPlayed: RecentlyPlayed;
  tracks: Item[];
  spinnerColor = ColorsEnum.ORANGE;
  currentImage: Image;
  nextImage: Image;
  previousImage: Image;
  currentTrack: Item;
  previousTrack: Item;
  nextTrack: Item;
  hasCurrentImage = true;
  hasNextImage = true;
  hasPreviousImage = true;
  isPlaying = false;
  player: Player;

  private _playlists: Playlists;
  private _lastTrack: Item;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService,
              private _discoverService: DiscoverService,
              private _playlistService: PlaylistService,
              private _snackBarService: SnackBarService,
              private _linkTileService: LinkTileService) {super(contextMenuService, resizeService); }

  ngOnInit(): void {
    super.ngOnInit();
    this._discoverService.hasTracksUpdated().subscribe((tracks: Item[]) => {
      this.tracks = tracks;
    });
    this._discoverService.isLoading().subscribe((loading: boolean) => {
      this.loading = loading;
    });
    this._discoverService.hasCurrentTrackUpdated().subscribe((track: Item) => {
      this.currentTrack = track;
    });
    this._discoverService.hasNextTrackUpdated().subscribe((track: Item) => {
      this.nextTrack = track;
    });
    this._discoverService.hasPreviousTrackUpdated().subscribe((track: Item) => {
      this.previousTrack = track;
    });
    this._discoverService.hasCurrentTrackImageUpdated().subscribe((image: Image) => {
      this.hasCurrentImage = true;
      this.currentImage = image;
    });
    this._discoverService.hasNextTrackImageUpdated().subscribe((image: Image) => {
      this.hasNextImage = true;
      this.nextImage = image;
    });
    this._discoverService.hasPreviousTrackImageUpdated().subscribe((image: Image) => {
      this.hasPreviousImage = true;
      this.previousImage = image;
    });
    this._playlistService.hasPlaylistsUpdated().subscribe((playlists: Playlists) => {
      this._playlists = playlists;
    });
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      const isFollowedTrack = !this.tracks.map(value => value.id).includes(player?.item?.id);
      if (!this._spotifyService.isFollowedPlayback) {
        if (this._lastTrack?.id !== player?.item.id && !isFollowedTrack) {
          this._lastTrack = player.item;
          this._discoverService.silentSkip(this._lastTrack);
        } else {
          this.isPlaying = this.player.is_playing && !isFollowedTrack;
        }
      }
      this._spotifyService.isFollowedPlayback = isFollowedTrack;
    });
    this._discoverService.load();
  }

  onHintClick(): void {
    this.hintOpened = !this.hintOpened;
  }

  onCurrentImageError(): void {
    this.hasCurrentImage = false;
  }

  onNextImageError(): void {
    this.hasNextImage = false;
  }

  onPreviousImageError(): void {
    this.hasPreviousImage = false;
  }

  onLikeClick(superLike: boolean): void {
    const discoverPlaylistExists = this.discoverPlaylistExists();
    if (discoverPlaylistExists) {
      const playlist = this.getDiscoverPlaylist();
      this._spotifyService.addTracksToPlaylist(playlist.id, [ this.currentTrack.uri ]).subscribe(() => {
        if (superLike) {
          this._spotifyService.followTrack(this.currentTrack.id).subscribe();
        }

        this.onSuccess();
      }, error => {
        this.onFailure();
      });
    } else {
      const playlistData = {
        name : 'Odkrywaj',
        description : ''
      };
      this._spotifyService.creatPlaylist(playlistData).subscribe((response: Playlist) => {
        this._playlistService.refreshPlaylists();

        this._spotifyService.addTracksToPlaylist(response.id, [ this.currentTrack.uri ]).subscribe(() => {
          if (superLike) {
            this._spotifyService.followTrack(this.currentTrack.id).subscribe();
          }

          this.onSuccess();
        }, error => {
          this.onFailure();
        });
      }, error => {
        this.onFailure();
      });
    }
  }

  onDislikeClick(): void {
    this.next();
  }

  onArtistClick(artist: Artist): void {
    if (artist) {
      this._spotifyService.getArtists([ artist.id ]).subscribe((artists: Artists) => {
        const config = {
          contentType : ContentType.artist,
          artist : artists.artists[ 0 ]
        };
        this._linkTileService.updateLinkTile(config);
      });
    }
  }

  onNameClick(): void {
    const album = this.currentTrack.album;
    if (album) {
      const config = {
        contentType : ContentType.album,
        album
      };
      this._linkTileService.updateLinkTile(config);
    }
  }

  next(): void {
    this._spotifyService.next().subscribe();
    this._discoverService.nextTrack();
  }

  previous(): void {
    this._spotifyService.previous().subscribe();
    this._discoverService.previousTrack();
  }

  play(): void {
    if (!this._spotifyService.isFollowedPlayback) {
      this._spotifyService.play().subscribe(() => {
        this.isPlaying = true;
        this._spotifyService.isFollowedPlayback = false;
      });
    } else {
      const uris = this.getUris();
      this._spotifyService.setShuffleState(false);
      this._spotifyService.playFromUris(uris, this._discoverService.currentIndex).subscribe(() => {
        this.isPlaying = true;
        this._spotifyService.isFollowedPlayback = false;
      });
    }
  }

  pause(): void {
    this._spotifyService.pause().subscribe();
    this.isPlaying = false;
  }

  private getDiscoverPlaylist(): Playlist {
    return this._playlists.items.find((playlist: Playlist) => playlist.name === 'Odkrywaj');
  }

  private discoverPlaylistExists(): boolean {
    const playlist = this.getDiscoverPlaylist();
    return playlist != null;
  }

  private onSuccess(): void {
    this._snackBarService.showSnackBar('Pomyślnie dodano utwór do playlisty: Odkrywaj');
  }

  private onFailure(): void {
    this._snackBarService.showSnackBar('Nie udało się dodać utworu do playlisty');
  }

  private getUris(): string[] {
    return this.tracks.map((track: Item) => track.uri);
  }

}
