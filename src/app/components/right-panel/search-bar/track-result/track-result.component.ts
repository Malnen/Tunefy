import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../models/item.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';
import { ContextMenuService } from '../../../../services/context-menu/context-menu.service';
import { ResizeService } from '../../../../services/resize-service/resize.service';

@Component({
  selector : 'app-track-result',
  templateUrl : './track-result.component.html',
  styleUrls : [ './track-result.component.scss' ]
})

export class TrackResultComponent extends BaseComponent implements OnInit {

  @Input() track: Item;

  imageHover: boolean;
  player: Player;
  isCurrentTrack: boolean;

  constructor(contextMenuService: ContextMenuService,
              resizeService: ResizeService,
              private _spotifyService: SpotifyService) {
    super(contextMenuService, resizeService);
    this.options = [
      {
        label : 'Dodaj do kolejki',
        action : this.addToQueue.bind(this)
      }
    ];
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.isCurrentTrack = this.player?.item?.id === this.track.id;
    });
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

  private addToQueue(): void {
    this._spotifyService.addTrackToQueue(this.track).subscribe();
  }

}
