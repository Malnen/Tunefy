import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../models/item.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Player } from '../../../../models/player.interface';
import { BaseComponent } from '../../../base-component/base.component';

@Component({
  selector : 'app-track-result',
  templateUrl : './track-result.component.html',
  styleUrls : [ './track-result.component.scss' ]
})

export class TrackResultComponent extends BaseComponent implements OnInit {

  @Input() track: Item;

  hover: boolean;
  imageHover: boolean;
  player: Player;
  isCurrentTrack: boolean;

  constructor(private _spotifyService: SpotifyService) {
    super();
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

  onHover(event: boolean): void {
    this.hover = event;
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
