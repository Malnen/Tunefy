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

@Component({
  selector : 'app-track-cell',
  templateUrl : './track-cell.component.html',
  styleUrls : [ './track-cell.component.scss' ]
})
export class TrackCellComponent extends BaseComponent implements OnInit {

  @Input() playlistItem: PlaylistItem;
  @Input() index: number;
  @Input() playlist: Playlist;

  @Output() unfollowed = new EventEmitter<Item>();

  artists: string;
  track: Item;
  duration: string;
  addedAt: string;
  image: Image;
  hasImage = true;
  isCurrent = false;
  isPlaying = false;

  constructor(contextMenuService: ContextMenuService,
              protected spotifyService: SpotifyService) {
    super(contextMenuService);
  }

  ngOnInit(): void {
    this.setTrack();
    this.setArtists();
    this.setDuration();
    this.setAddedAt();
    this.setImage();
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
      this.track.followed = false;
      this.spotifyService.unFollowTrack(this.track.id).subscribe();
      this.unfollowed.emit(this.track);
    } else {
      this.track.followed = true;
      this.spotifyService.followTrack(this.track.id).subscribe();
    }
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
