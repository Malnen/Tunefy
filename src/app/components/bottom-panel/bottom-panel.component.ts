import {Component, OnInit} from '@angular/core';
import {Player} from '../../models/player.interface';
import {SpotifyService} from '../../services/spotify/spotify.service';
import {RepeatState} from '../../enums/repeat-state.enum';

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.scss']
})
export class BottomPanelComponent implements OnInit {

  player: Player;
  repeatState = RepeatState;
  currentRepeatState: RepeatState = RepeatState.OFF;
  currentShuffleState: boolean;
  devicesPopUpOpen: boolean;
  devicesPopUpHover: boolean;
  devicePopUpShow: boolean;
  opacity = 0;

  private _timer: number;
  private _ignoreNextRepeatState: boolean;
  private _ignoreNextShuffleState: boolean;

  constructor(private _spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      if (!this._ignoreNextRepeatState) {
        this.currentRepeatState = player?.repeat_state;
      }
      if (!this._ignoreNextShuffleState) {
        this.currentShuffleState = player?.shuffle_state;
      }
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

  toggleDevicePopUp(): void {
    this.devicesPopUpOpen = !this.devicesPopUpOpen;
    if (this.devicesPopUpOpen) {
      this.devicePopUpShow = true;
      setTimeout(() => this.opacity = 1, 10);
    } else {
      this.opacity = 0;
      setTimeout(() => this.devicePopUpShow = false, 250);
    }
  }

  onDevicePopUpMouseOver(): void {
    this.devicesPopUpHover = true;
  }

  onDevicePopUpMouseLeave(): void {
    this.devicesPopUpHover = false;
  }

  private getNextState(): any {
    const currentState = this.player.repeat_state?.toUpperCase();
    const index = Object.keys(this.repeatState).indexOf(currentState);
    const enumLength = Object.keys(this.repeatState).length;
    if (index < enumLength - 1) {
      return Object.values(this.repeatState)[index + 1];
    } else {
      return Object.values(this.repeatState)[0];
    }
  }

}
