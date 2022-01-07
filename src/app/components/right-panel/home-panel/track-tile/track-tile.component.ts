import { Component, Input, OnInit } from '@angular/core';
import { RecentlyPlayedItem } from '../../../../models/recently-played-item.interface';
import { Image } from '../../../../models/image.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';
import { Option } from '../../../../models/option.interface';
import { Artist } from '../../../../models/artist.interface';
import { Artists } from '../../../../models/artists.interface';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { Playlists } from '../../../../models/playlists.interface';
import { Playlist } from '../../../../models/playlist.interface';
import { SnackBarService } from '../../../../services/snack-bar-service/snack-bar.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';
import { DialogService } from '../../../../services/dialog/dialog.service';

@Component({
  selector : 'app-track-tile',
  templateUrl : './track-tile.component.html',
  styleUrls : [ './track-tile.component.scss' ]
})
export class TrackTileComponent extends BaseComponent implements OnInit {

  @Input() recentlyPlayed: RecentlyPlayedItem;

  image: Image;
  hasImage = true;
  isPlaying = false;
  playlists: Playlists;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _dialogService: DialogService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService,
              private _playlistService: PlaylistService,
              private _snackBarService: SnackBarService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this.image = this.recentlyPlayed.track.album.images[ 0 ];
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.isPlaying = player?.item.id === this.recentlyPlayed.track.id && player.is_playing;
    });
    this._playlistService.hasPlaylistsUpdated().subscribe((playlists: Playlists) => {
      this.playlists = playlists;
    });
    this.setOptions();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  play(event: Event): void {
    this._spotifyService.play(this.recentlyPlayed.track).subscribe();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  pause(event: Event): void {
    this._spotifyService.pause().subscribe();
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onClick(): void {
    const config = {
      contentType : ContentType.album,
      album : this.recentlyPlayed.track.album
    };
    this._linkTileService.updateLinkTile(config);
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
        subOptions : this.getPlaylistsOptions(),
        showDivider : true
      },
      {
        label : 'Tekst utworu',
        action : this.showLyrics.bind(this)
      },
      {
        label : 'Cechy utworu',
        action : this.showAudioFeatures.bind(this)
      }
    ];
  }

  private addToQueue(): void {
    this._spotifyService.addTrackToQueue(this.recentlyPlayed.track).subscribe(() => {
      this._snackBarService.showSnackBar('Utwór został dodany do kolejki');
    });
  }

  private navigateToAlbum(): void {
    const config = {
      contentType : ContentType.album,
      album : this.recentlyPlayed.track.album
    };
    this._linkTileService.updateLinkTile(config);
  }

  private getArtistSubOptions(): Option[] {
    const options = [];
    if (this.recentlyPlayed) {
      for (const artist of this.recentlyPlayed?.track.artists) {
        options.push({
          label : artist.name,
          action : () => this.navigateToArtist(artist)
        });
      }
    }

    return options;
  }

  private getPlaylistsOptions(): Option[] {
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
    this._spotifyService.addTracksToPlaylist(playlist.id, [ this.recentlyPlayed.track.uri ]).subscribe(() => {
      this._snackBarService.showSnackBar(`Utwór został dodany do playlisty: ${ playlist.name }`);
    }, (error => {
      this._snackBarService.showSnackBar('Nie udało się dodać utworu do playlisty');
    }));
  }

  private navigateToArtist(artist: Artist): void {
    this._spotifyService.getArtists([ artist.id ]).subscribe((artists: Artists) => {
      const config = {
        contentType : ContentType.artist,
        artist : artists.artists[ 0 ]
      };
      this._linkTileService.updateLinkTile(config);
    });
  }

  private showLyrics(): void {
    this._dialogService.openLyricsDialog(this.recentlyPlayed.track);
  }

  private showAudioFeatures(): void {
    this._dialogService.openAudioFeaturesDialog(this.recentlyPlayed.track);
  }

}
