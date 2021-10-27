import { Component, Input, OnInit } from '@angular/core';
import { RecentlyPlayedItem } from '../../../../models/recently-played-item.interface';
import { Image } from '../../../../models/image.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';

@Component({
  selector : 'app-recently-played-tile',
  templateUrl : './recently-played-tile.component.html',
  styleUrls : [ './recently-played-tile.component.scss' ]
})
export class RecentlyPlayedTileComponent extends BaseComponent implements OnInit {

  @Input() recentlyPlayed: RecentlyPlayedItem;

  image: Image;
  hasImage = true;
  isPlaying = false;

  constructor(contextMenuService: ContextMenuService,
              private _spotifyService: SpotifyService) {
    super(contextMenuService);
    this.options = [
      {
        label : 'Dodaj do kolejki',
        action : this.addToQueue.bind(this)
      }
    ];
  }

  ngOnInit(): void {
    this.image = this.recentlyPlayed.track.album.images[ 0 ];
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.isPlaying = player?.item.id === this.recentlyPlayed.track.id && player.is_playing;
    });
  }

  onImageError(): void {
    this.hasImage = false;
  }

  play(): void {
    this._spotifyService.play(this.recentlyPlayed.track).subscribe();
  }

  pause(): void {
    this._spotifyService.pause().subscribe();
  }

  private addToQueue(): void {
    this._spotifyService.addTrackToQueue(this.recentlyPlayed.track).subscribe();
  }

}
