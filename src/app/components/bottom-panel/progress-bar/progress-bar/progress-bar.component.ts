import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SpotifyService} from '../../../../services/spotify/spotify.service';
import {Player} from '../../../../models/player.interface';
import * as moment from 'moment';
import {Animations} from '../../../../animations/animations';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  animations: [Animations.backgroundColor]
})
export class ProgressBarComponent implements OnInit, OnChanges {

  @ViewChild('background') background: ElementRef;
  @ViewChild('foreground') foreground: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;

  @Input() player: Player;

  progress = 0;
  thumbMarginLeft = 0;
  hover: boolean;
  hold: boolean;
  progressMs = '0:00';
  durationMs = '0:00';

  private _percentage = 0;
  private _click: boolean;
  private _ignoreNextPlayerUpdate: boolean;
  private _holdTimer: number;

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
      const ms = Math.floor(this.player.item.duration_ms * this._percentage / 100);
      this._spotifyService.seek(ms).subscribe((data: any) => {
      });
      this._ignoreNextPlayerUpdate = true;
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
      const offset = this.progressBar.nativeElement.offsetLeft;
      const position = event.x - offset;
      const width = this.progressBar.nativeElement.offsetWidth;
      const percentage = position / width * 100;
      this._percentage = percentage;
      this.progress = percentage;
      this.setThumbMargin();
      this.setText();
    }
  }

  private setProgress(): void {
    if (!this._ignoreNextPlayerUpdate && !this.hold) {
      this.setProgressFromPlayer();
    }

    this.setText();
  }

  private setProgressFromPlayer(): void {
    if (this.player == null) {
      this.progress = 0;
    } else {
      const duration = this.player.item?.duration_ms;
      const progress = this.player.progress_ms;
      this.progress = progress / duration * 100;
      this._percentage = this.progress;
      this.setThumbMargin();
      this.setText();
    }
  }

  private setThumbMargin(): void {
    let margin = this.background?.nativeElement.offsetWidth * this.progress / 100 - 4;
    if (margin < 0) {
      margin = 0;
    }
    this.thumbMarginLeft = margin;
  }

  private setText(): void {
    const duration = this.player?.item?.duration_ms ?? 0;
    const percentage = isNaN(this._percentage) ? 0 : this._percentage;
    let progress = Math.floor(duration * percentage / 100);
    if (progress < 0) {
      progress = 0;
    }
    const progressMs = moment(progress).format('m:ss');
    const durationMs = moment(duration).format('m:ss');
    this.progressMs = progressMs;
    this.durationMs = durationMs;
  }

}
