import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../../../../models/item.interface';
import { Artist } from '../../../../../models/artist.interface';
import { PlaylistItem } from '../../../../../models/playlist-item.interface';
import * as moment from 'moment';
import { Image } from '../../../../../models/image.interface';
import { BaseComponent } from '../../../../base-component/base.component';
import { SpotifyService } from '../../../../../services/spotify/spotify.service';
import { Playlist } from '../../../../../models/playlist.interface';
import { ContextMenuService } from '../../../../../services/context-menu/context-menu.service';
import { Player } from '../../../../../models/player.interface';
import { SnackBarService } from '../../../../../services/snack-bar-service/snack-bar.service';
import { ContentType } from '../../../../../enums/content-type.enum';
import { LinkTileService } from '../../../../../services/link-tile/link-tile.service';
import { Option } from '../../../../../models/option.interface';
import { Artists } from '../../../../../models/artists.interface';
import { Playlists } from '../../../../../models/playlists.interface';
import { ResizeService } from '../../../../../services/resize-service/resize.service';

@Component({
  selector : 'app-track-cell',
  templateUrl : './track-cell.component.html',
  styleUrls : [ './track-cell.component.scss' ]
})
export class TrackCellComponent extends BaseComponent implements OnInit {

  @Input() playlistItem: PlaylistItem;
  @Input() index: number;
  @Input() playlist: Playlist;
  @Input() playlists: Playlists;

  @Output() unfollowed = new EventEmitter<Item>();
  @Output() refresh = new EventEmitter<void>();

  artists: string;
  track: Item;
  duration: string;
  addedAt: string;
  image: Image;
  hasImage = true;
  isCurrent = false;
  isPlaying = false;

  private _isFollowedPlaylist = false;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              protected spotifyService: SpotifyService,
              private _snackBarService: SnackBarService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this._isFollowedPlaylist = this.playlist?.owner.uri === 'followed';
    this.setTrack();
    this.setArtists();
    this.setDuration();
    this.setAddedAt();
    this.setImage();
    this.setOptions();
    this.spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.isCurrent = player?.item?.id === this.track.id;
      this.isPlaying = player?.is_playing;
    });
  }

  onImageError(): void {
    this.hasImage = false;
  }

  play(): void {
    if (this.isCurrent) {
      this.spotifyService.play().subscribe();
    } else {
      if (this.playlist.uri != null) {
        this.spotifyService.playPlaylist(this.playlist, this.playlistItem.index).subscribe();
      } else {
        this.spotifyService.playFromLastFollowedUris(this.playlistItem.index).subscribe();
      }
    }
  }

  pause(): void {
    this.spotifyService.pause().subscribe();
  }

  onFollowClick(): void {
    if (this.track.followed) {
      this.unFollow();
    } else {
      this.follow();
    }
  }

  private unFollow(): void {
    this.track.followed = false;
    this.spotifyService.unFollowTrack(this.track.id).subscribe();
    this.unfollowed.emit(this.track);
  }

  private follow(): void {
    this.track.followed = true;
    this.spotifyService.followTrack(this.track.id).subscribe();
  }

  private setOptions(): void {
    this.options = [
      {
        label : 'Dodaj do kolejki',
        action : this.addToQueue.bind(this),
        showDivider : true
      },
      {
        label : 'Przejdź do albumu',
        action : this.navigateToAlbum.bind(this)
      },
      {
        label : 'Przejdź do artysty',
        action : () => {},
        expandable : true,
        subOptions : this.getArtistSubOptions(),
        showDivider : true
      },
      {
        label : 'Dodaj do playlisty',
        action : () => {},
        expandable : true,
        subOptions : this.getPlaylistsAddOptions()
      },
      {
        label : this._isFollowedPlaylist ? 'Przestań obserwować' : 'Usuń z playlisty',
        action : () => this._isFollowedPlaylist ? this.unFollow() : this.deleteTrackFromPlaylist(this.playlist)
      }
    ];
  }

  private addToQueue(): void {
    this.spotifyService.addTrackToQueue(this.track).subscribe(() => {
      this._snackBarService.showSnackBar('Utwór został dodany do kolejki');
    });
  }

  private navigateToAlbum(): void {
    const config = {
      contentType : ContentType.album,
      album : this.track.album
    };
    this._linkTileService.updateLinkTile(config);
  }

  private getArtistSubOptions(): Option[] {
    const options = [];
    if (this.track) {
      for (const artist of this.track.artists) {
        options.push({
          label : artist.name,
          action : () => this.navigateToArtist(artist)
        });
      }
    }

    return options;
  }

  private getPlaylistsAddOptions(): Option[] {
    const options = [];
    if (this.playlists) {
      for (const playlist of this.playlists?.items) {
        options.push({
          label : playlist.name,
          action : () => this.addTrackToPlaylist(playlist)
        });
      }
    }

    return options;
  }

  private addTrackToPlaylist(playlist: Playlist): void {
    this.spotifyService.addTracksToPlaylist(playlist.id, [ this.track.uri ]).subscribe(() => {
      this._snackBarService.showSnackBar(`Utwór został dodany do playlisty: ${ playlist.name }`);
      if (this.playlist.id === playlist.id) {
        this.refresh.emit();
      }
    }, (error => {
      this._snackBarService.showSnackBar('Nie udało się dodać utworu do playlisty');
    }));
  }


  private deleteTrackFromPlaylist(playlist: Playlist): void {
    this.spotifyService.deleteTracksToPlaylist(playlist.id, [ this.track.uri ]).subscribe(() => {
      if (!this._isFollowedPlaylist) {
        this._snackBarService.showSnackBar(`Utwór został usunięty z playlisty: ${ playlist.name }`);
        this.refresh.emit();
      }
    }, (error => {
      if (!this._isFollowedPlaylist) {
        this._snackBarService.showSnackBar('Nie udało się usunąć utworu z playlisty');
      }
    }));
  }

  private navigateToArtist(artist: Artist): void {
    this.spotifyService.getArtists([ artist.id ]).subscribe((artists: Artists) => {
      const config = {
        contentType : ContentType.artist,
        artist : artists.artists[ 0 ]
      };
      this._linkTileService.updateLinkTile(config);
    });
  }

  protected setTrack(): void {
    this.track = this.playlistItem.track;
  }

  protected setImage(): void {
    this.image = this.track.album.images[ 0 ];
  }

  protected setAddedAt(): void {
    this.addedAt = moment(this.playlistItem.added_at).format('YYYY-MM-DD');
  }

  private setDuration(): void {
    this.duration = moment(this.track.duration_ms).format('mm:ss');
  }

  private setArtists(): void {
    const artists = this.track.artists.map((artist: Artist) => artist.name);
    this.artists = artists.join(', ');
  }

}
