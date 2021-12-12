import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../../../models/item.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';
import { ContentType } from '../../../../enums/content-type.enum';
import { Option } from '../../../../models/option.interface';
import { Playlist } from '../../../../models/playlist.interface';
import { Artist } from '../../../../models/artist.interface';
import { Artists } from '../../../../models/artists.interface';
import { SnackBarService } from '../../../../services/snack-bar-service/snack-bar.service';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { Playlists } from '../../../../models/playlists.interface';

@Component({
  selector : 'app-track-result',
  templateUrl : './track-result.component.html',
  styleUrls : [ './track-result.component.scss' ]
})

export class TrackResultComponent extends BaseComponent implements OnInit {

  @Input() track: Item;
  @Input() playlists: Playlists;

  @Output() close = new EventEmitter<void>();

  imageHover: boolean;
  player: Player;
  isCurrentTrack: boolean;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService,
              private _snackBarService: SnackBarService,
              private _linkTileService: LinkTileService) {
    super(contextMenuService, resizeService);
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.isCurrentTrack = this.player?.item?.id === this.track.id;
    });
    this.setOptions();
  }

  onImageMouseOver(): void {
    this.imageHover = true;
  }

  onImageMouseLeave(): void {
    this.imageHover = false;
  }

  onPlayClick(): void {
    this._spotifyService.play(this.track).subscribe();
  }

  onPauseClick(): void {
    this._spotifyService.pause().subscribe();
  }

  navigateToAlbum(): void {
    const config = {
      contentType : ContentType.album,
      album : this.track.album
    };
    this._linkTileService.updateLinkTile(config);
    this.close.emit();
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
        subOptions : this.getPlaylistsOptions()
      }
    ];
  }

  private addToQueue(): void {
    this._spotifyService.addTrackToQueue(this.track).subscribe(() => {
      this._snackBarService.showSnackBar('Utwór został dodany do kolejki');
    });
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
    this._spotifyService.addTracksToPlaylist(playlist.id, [ this.track.uri ]).subscribe(() => {
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
      this.close.emit();
    });
  }

}
