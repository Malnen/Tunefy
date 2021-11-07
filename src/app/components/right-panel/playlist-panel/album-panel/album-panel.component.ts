import { Component, Input, OnInit } from '@angular/core';
import { PlaylistPanelComponent } from '../playlist-panel.component';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { Album } from '../../../../models/album.interface';
import { Observable } from 'rxjs';
import { PlaylistTracks } from '../../../../models/playlist-tracks.interface';
import { AlbumResponse } from '../../../../models/album-response.interface';
import { Item } from '../../../../models/item.interface';
import { Player } from '../../../../models/player.interface';

@Component({
  selector : 'app-album-panel',
  templateUrl : './album-panel.component.html',
  styleUrls : [ './album-panel.component.scss' ]
})
export class AlbumPanelComponent extends PlaylistPanelComponent implements OnInit {

  @Input() album: Album;

  albumTracks: AlbumResponse;

  constructor(spotifyService: SpotifyService,
              playlistService: PlaylistService) {
    super(spotifyService, playlistService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  playRandom(): void {
    this.spotifyService.setShuffleState(true).subscribe(() => {
      const offset = Math.floor(Math.random() * (this.album.total_tracks + 1));
      this.spotifyService.playAlbum(this.album, offset).subscribe();
    });
  }

  protected setContext(): void {
    this.context = { uri : this.album.uri };
  }

  protected getLoadTracksObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getAlbumTracks(this.album.id);
  }

  protected getLoadNextObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getAlbumTracks(this.album.id, this.playlistTracks.next);
  }

  protected checkMarkets(album: AlbumResponse, length?: number): void {
    const items = album.tracks.items;
    let index = length != null ? length - this.disabledItemsCount : 0;
    for (const item of items) {
      item.disabled = item.restrictions != null;
      item.index = index;
      index++;
    }
  }

  protected loadTracks(): void {
    this.getLoadTracksObservable().subscribe((album: AlbumResponse) => {
      this.checkMarkets(album);
      this.albumTracks = album;
      this.albumTracks.total = album.total;
      this.loading = false;
      this.checkFollows();
      this.filter();
    });
  }

  protected checkFollows(albumTracks?: AlbumResponse, length?: number): void {
    const chunk = 50;
    const tracks = albumTracks?.tracks ?? this.albumTracks.tracks;
    const offset = length ?? 0;
    const items = tracks.items;
    for (let i = 0; i < items.length; i += chunk) {
      const temp = items.slice(i, i + chunk);
      this.spotifyService.checkIfTrackItemAreFollowed(temp).subscribe((response: boolean[]) => {
        for (let j = 0; j < response.length - 1; j++) {
          this.albumTracks.tracks.items[ i + j + offset ].followed = response[ j ];
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
    this.tracksToRender = this.albumTracks.tracks.items.filter((item: Item) => {
      if (hasSearchValue) {
        const searchValue = this.searchValue.toLocaleLowerCase();
        const includesName = item.name.toLocaleLowerCase().includes(searchValue);
        let includesArtist = false;
        for (const artist of item.artists) {
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

  protected listenToPlayer(): void {
    this.spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.isCurrent = this.player?.context?.uri === this.album?.uri;
      this.isPlaying = this.player?.is_playing && this.isCurrent;
    });
  }

  protected loadImage(): void {
    if (this.album?.images.length > 0) {
      this.hasImage = true;
      this.image = this.album.images[ 0 ];
    } else {
      this.hasImage = false;
    }
  }

  protected getPlayObservable(): Observable<any> {
    return this.spotifyService.playAlbum(this.album);
  }

}
