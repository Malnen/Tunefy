import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player.interface';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { RepeatState } from '../../enums/repeat-state.enum';
import { VolumeState } from '../../enums/volume-state.enum';
import { Item } from '../../models/item.interface';
import { Image } from '../../models/image.interface';
import { Artist } from '../../models/artist.interface';
import { PopUpContentType } from '../../enums/pop-up-content-type.enum';

@Component({
  selector : 'app-bottom-panel',
  templateUrl : './bottom-panel.component.html',
  styleUrls : [ './bottom-panel.component.scss' ]
})
export class BottomPanelComponent implements OnInit {

  player: Player;
  repeatState = RepeatState;
  currentRepeatState: RepeatState = RepeatState.OFF;
  currentShuffleState: boolean;
  currentVolume = 100;
  volumeState: VolumeState = VolumeState.VOLUME_UP;
  currentItem: Item;
  image: Image;
  artists: Artist[];
  popUpContentType = PopUpContentType;

  private _timer: any;
  private _ignoreNextRepeatState: boolean;
  private _ignoreNextShuffleState: boolean;
  private _ignoreVolumeState: boolean;
  private _lastVolumePercentage = 100;

  constructor(private _spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      this.setRepeatState();
      this.setShuffleState();
      this.setVolumeIcon();
      this.setItem();
    });
  }

  previous(): void {
    this._spotifyService.previous().subscribe((data: any) => {

    });
  }

  play(): void {
    this._spotifyService.play().subscribe((data: any) => {

    });
  }

  pause(): void {
    this._spotifyService.pause().subscribe((data: any) => {

    });
  }

  next(): void {
    this._spotifyService.next().subscribe((data: any) => {

    });
  }

  toggleRepeatState(): void {
    const nextState = this.getNextState();
    this.currentRepeatState = nextState;
    this._ignoreNextRepeatState = true;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._ignoreNextRepeatState = false, 2000);
    this._spotifyService.setRepeatState(nextState).subscribe((data: any) => {
    });
  }

  toggleShuffleState(): void {
    const nextState = !this.player.shuffle_state;
    this.currentShuffleState = nextState;
    this._ignoreNextShuffleState = true;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._ignoreNextShuffleState = false, 2000);
    this._spotifyService.setShuffleState(nextState).subscribe((data: any) => {
    });
  }

  onVolumeClick(): void {
    let volume: number;
    switch (this.volumeState) {
      case VolumeState.VOLUME_OFF:
        volume = this._lastVolumePercentage;
        if (volume === 0) {
          volume = 100;
        }

        this.currentVolume = volume;
        break;
      default:
        this._lastVolumePercentage = this.currentVolume;
        volume = 0;
        this.currentVolume = volume;
    }

    this.player.device.volume_percent = volume;
    this.setVolumeIcon();
    this._timer = setTimeout(() => this._ignoreVolumeState = false, 2000);
    this._spotifyService.setVolume(volume).subscribe();
  }

  private getNextState(): any {
    const currentState = this.player.repeat_state?.toUpperCase();
    const index = Object.keys(this.repeatState).indexOf(currentState);
    const enumLength = Object.keys(this.repeatState).length;
    if (index < enumLength - 1) {
      return Object.values(this.repeatState)[ index + 1 ];
    } else {
      return Object.values(this.repeatState)[ 0 ];
    }
  }

  private setRepeatState(): void {
    if (!this._ignoreNextRepeatState) {
      this.currentRepeatState = this.player?.repeat_state;
    }
  }

  private setShuffleState(): void {
    if (!this._ignoreNextShuffleState) {
      this.currentShuffleState = this.player?.shuffle_state;
    }
  }

  private setVolumeIcon(): void {
    if (!this._ignoreVolumeState) {
      this.currentVolume = this.player?.device.volume_percent;
      const volume = this.currentVolume;
      if (volume <= 0) {
        this.volumeState = VolumeState.VOLUME_OFF;
      } else if (volume > 0 && volume <= 50) {
        this.volumeState = VolumeState.VOLUME_DOWN;
      } else {
        this.volumeState = VolumeState.VOLUME_UP;
      }
    }
  }

  private setItem(): void {
    if (this.player) {
      const item = this.player?.item;
      this.currentItem = item;

      const images = item?.album.images;
      if (images) {
        this.image = images[ 0 ];
      }

      this.artists = item?.artists;
    }
  }

}
