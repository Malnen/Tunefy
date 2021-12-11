import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { Player } from '../../../models/player.interface';
import * as moment from 'moment';
import { Animations } from '../../../animations/animations';

@Component({
  selector : 'app-volume-bar',
  templateUrl : './volume-bar.component.html',
  styleUrls : [ './volume-bar.component.scss' ],
  animations : [ Animations.backgroundColor ]
})
export class VolumeBarComponent implements OnInit, OnChanges {
  @ViewChild('background') background: ElementRef;
  @ViewChild('foreground') foreground: ElementRef;
  @ViewChild('volumeBar') volumeBar: ElementRef;

  @Input() player: Player;

  thumbMarginLeft = 0;
  hover: boolean;
  hold: boolean;
  percentage = 0;

  private _click: boolean;
  private _ignoreNextPlayerUpdate: boolean;
  private _holdTimer: any;

  constructor(private _spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.onResize();
  }

  onResize(): void {
    this.thumbMarginLeft = this.background?.nativeElement.offsetWidth - 8;
    this.setThumbMargin();

  }

  ngOnChanges(): void {
    this.setProgress();
    this.setThumbMargin();
  }

  onMouseOver(): void {
    this.hover = true;
  }

  onMouseLeave(): void {
    this.hover = false;
  }

  onProgressBarDown(): void {
    this._holdTimer = setTimeout(() => this.hold = true, 100);
  }

  onProgressBarUp(): void {
    clearTimeout(this._holdTimer);
    if (this.hold || this._click) {
      this._ignoreNextPlayerUpdate = true;
      this.setVolume();
      setTimeout(() => this._ignoreNextPlayerUpdate = false, 1000);
    }

    this.hold = false;
  }

  onProgressbarClick(event: MouseEvent): void {
    this._click = true;
    this.onProgressBarDown();
    this.onProgressBarMove(event);
    this.onProgressBarUp();
    this._click = false;
  }

  onProgressBarMove(event: MouseEvent): void {
    if (this.hold || this._click) {
      const offset = this.volumeBar.nativeElement.getBoundingClientRect().x;
      const position = event.x - offset;
      const width = this.volumeBar.nativeElement.offsetWidth;
      this.percentage = position / width * 100;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
      this.setVolume(true);
      this.setThumbMargin();
    }
  }

  private setProgress(): void {
    if (!this._ignoreNextPlayerUpdate && !this.hold) {
      this.setProgressFromPlayer();
    }
  }

  private setProgressFromPlayer(): void {
    if (this.player == null) {
      this.percentage = 100;
    } else {
      this.percentage = this.player.device.volume_percent;
      this.setThumbMargin();
    }
  }

  private setThumbMargin(): void {
    let margin = this.background?.nativeElement.offsetWidth * this.percentage / 100 - 4;
    if (margin < 0) {
      margin = 0;
    }
    this.thumbMarginLeft = margin;
  }

  private setVolume(slow = false): void {
    const volume = Math.floor(this.percentage);
    const playerVolume = this.player.device.volume_percent;
    if (slow) {
      if (Math.abs(volume - playerVolume) > 5) {
        this._spotifyService.setVolume(volume).subscribe();
      }
    } else {
      if (volume !== playerVolume) {
        this._spotifyService.setVolume(volume).subscribe();
      }
    }
  }

}
