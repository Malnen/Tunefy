import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../../models/item.interface';
import { Artist } from '../../../../../models/artist.interface';
import { PlaylistItem } from '../../../../../models/playlist-item.interface';
import * as moment from 'moment';
import { Image } from '../../../../../models/image.interface';
import { BaseComponent } from '../../../../base-component/base.component';
import { SpotifyService } from '../../../../../services/spotify/spotify.service';
import { Playlist } from '../../../../../models/playlist.interface';
import { ContextMenuService } from '../../../../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-track-cell',
  templateUrl : './track-cell.component.html',
  styleUrls : [ './track-cell.component.scss' ]
})
export class TrackCellComponent extends BaseComponent implements OnInit {

  @Input() playlistItem: PlaylistItem;
  @Input() index: number;
  @Input() playlist: Playlist;

  artists: string;
  track: Item;
  duration: string;
  addedAt: string;
  image: Image;
  hasImage = true;

  constructor(contextMenuService: ContextMenuService,
              private _spotifyService: SpotifyService) {
    super(contextMenuService);
  }

  ngOnInit(): void {
    this.setTrack();
    this.setArtists();
    this.setDuration();
    this.setAddedAt();
    this.setImage();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  play(): void {
    this._spotifyService.playPlaylist(this.playlist, this.playlistItem.index).subscribe();
  }

  private setTrack(): void {
    this.track = this.playlistItem.track;
  }

  private setDuration(): void {
    this.duration = moment(this.track.duration_ms).format('mm:ss');
  }

  private setArtists(): void {
    const artists = this.track.artists.map((artist: Artist) => artist.name);
    this.artists = artists.join(', ');
  }

  private setAddedAt(): void {
    this.addedAt = moment(this.playlistItem.added_at).format('YYYY-MM-DD');
  }

  private setImage(): void {
    this.image = this.track.album.images[ 0 ];
  }

}
