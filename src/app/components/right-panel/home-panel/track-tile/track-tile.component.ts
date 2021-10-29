import { Component, Input, OnInit } from '@angular/core';
import { RecentlyPlayedItem } from '../../../../models/recently-played-item.interface';
import { Image } from '../../../../models/image.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { LinkTileService } from '../../../../services/link-tile/link-tile.service';
import { ContentType } from '../../../../enums/content-type.enum';

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

  constructor(contextMenuService: ContextMenuService,
              private _spotifyService: SpotifyService,
              private _linkTileService: LinkTileService) {
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

  private addToQueue(): void {
    this._spotifyService.addTrackToQueue(this.recentlyPlayed.track).subscribe();
  }

}
