import { Component, OnInit } from '@angular/core';
import { PlaylistPanelComponent } from '../playlist-panel.component';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { PlaylistService } from '../../../../services/playlist-service/playlist.service';
import { Observable } from 'rxjs';
import { PlaylistTracks } from '../../../../models/playlist-tracks.interface';
import { Profile } from '../../../../models/profile.interface';
import { Player } from '../../../../models/player.interface';
import { PlaylistItem } from '../../../../models/playlist-item.interface';
import { Item } from '../../../../models/item.interface';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';

@Component({
  selector : 'app-followed-panel',
  templateUrl : '../playlist-panel.component.html',
  styleUrls : [ '../playlist-panel.component.scss' ]
})
export class FollowedPanelComponent extends PlaylistPanelComponent implements OnInit {

  private _profile: Profile;
  private _uris: string[];

  constructor(spotifyService: SpotifyService,
              playlistService: PlaylistService,
              dialogService: DialogService,
              contextMenuService: ContextMenuService,
              resizeService: ResizeService) {
    super(contextMenuService, resizeService, spotifyService, playlistService, dialogService);
  }

  ngOnInit(): void {
    this._profile = this.spotifyService.getCurrentProfile();
    this.setPlaylist();
    super.ngOnInit();
  }

  playRandom(): void {
    this.spotifyService.setShuffleState(true).subscribe(() => {
      const offset = Math.floor(Math.random() * (this.playlistTracks.items.length + 1));
      this.spotifyService.playFromUris(this._uris, offset).subscribe();
    });
  }

  onUnfollowed(track: Item): void {
    this.removeFromTracks(track);
    this.removeFromTracksToRender(track);
  }

  protected getLoadTracksObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getFollowedTracks();
  }

  protected getLoadNextObservable(): Observable<PlaylistTracks> {
    return this.spotifyService.getFollowedTracks(this.playlistTracks.next);
  }

  protected getPlayObservable(): Observable<any> {
    return this.spotifyService.playFollowed(this.playlist);
  }

  protected listenToPlayer(): void {
    this.spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.isCurrent = this.player?.context === null;
      this.isPlaying = this.player?.is_playing && this.isCurrent;
    });
  }

  protected loadTracks(): void {
    this.getLoadTracksObservable().subscribe((playlistTracks: PlaylistTracks) => {
      this.checkMarkets(playlistTracks);
      this.playlistTracks = playlistTracks;
      this.playlist.tracks.total = playlistTracks.total;
      this.loading = false;
      this.checkFollows();
      this.filter();
      this.loadAll();
    });
  }

  protected afterLoad(): void {
    this._uris = this.getUris();
    this.spotifyService.updateLastFollowedUris(this._uris);
  }

  private setPlaylist(): void {
    this.playlist = {
      name : 'Polubione utwory',
      tracks : {
        total : 0,
        href : ''
      },
      uri : null,
      id : '',
      href : '',
      images : [],
      owner : {
        id : '',
        href : '',
        uri : 'followed',
        display_name : '',
        type : ''
      }
    };
  }

  protected checkFollows(playlistTracks?: PlaylistTracks, length?: number): void {
    const tracks = playlistTracks ?? this.playlistTracks;
    const items = tracks.items;
    for (const item of items) {
      item.track.followed = true;
    }
  }

  protected getUris(): string[] {
    return this.playlistTracks.items.map((track: PlaylistItem) => track.track.uri);
  }

  private removeFromTracksToRender(track: Item): void {
    const toRemove = this.playlistTracks.items.find(value => value.track === track);
    const index = this.playlistTracks.items.indexOf(toRemove);
    if (index > -1) {
      this.playlistTracks.items.splice(index, 1);
    }
  }

  private removeFromTracks(track: Item): void {
    const toRemove = this.tracksToRender.find(value => value.track === track);
    const index = this.tracksToRender.indexOf(toRemove);
    if (index > -1) {
      this.tracksToRender.splice(index, 1);
    }
  }

}
