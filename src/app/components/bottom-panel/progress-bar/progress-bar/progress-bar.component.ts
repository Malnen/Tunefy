import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SpotifyService} from '../../../../services/spotify/spotify.service';
import {Player} from '../../../../models/player.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {

  @ViewChild('background') background: ElementRef;
  @ViewChild('progressBar') progressBar: ElementRef;

  @Input() player: Player;

  progress = 0;
  thumbMarginLeft = 0;
  hover: boolean;
  hold: boolean;
  progressMs = '0:00';
  durationMs = '0:00';

  private percentage = 0;
  private ignoreNextPlayerUpdate: boolean;

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
    this.hold = true;
  }

  onProgressBarUp(): void {
    if (this.hold) {
      const ms = Math.floor(this.player.item.duration_ms * this.percentage / 100);
      this._spotifyService.seek(ms).subscribe((data: any) => {
        this._spotifyService.refreshPlayer();
      });
      this.ignoreNextPlayerUpdate = true;
      setTimeout(() => this.ignoreNextPlayerUpdate = false, 1500);
    }
    this.hold = false;

  }

  onProgressbarClick(event: MouseEvent): void {
    this.onProgressBarDown();
    this.onProgressBarMove(event);
    this.onProgressBarUp();
  }

  onProgressBarMove(event: MouseEvent): void {
    if (this.hold) {
      const offset = this.progressBar.nativeElement.offsetLeft;
      const position = event.x - offset;
      const width = this.progressBar.nativeElement.offsetWidth;
      const percentage = position / width * 100;
      this.percentage = percentage;
      this.progress = percentage;
      this.setThumbMargin();
      this.setText();
    }
  }

  private setProgress(): void {
    if (!this.ignoreNextPlayerUpdate) {
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
      this.percentage = this.progress;
      this.setThumbMargin();
      this.setText();
    }
  }

  private setThumbMargin(): void {
    this.thumbMarginLeft = this.background?.nativeElement.offsetWidth * this.progress / 100 - 8;
  }

  private setText(): void {
    const duration = this.player?.item?.duration_ms ?? 0;
    const percentage = isNaN(this.percentage) ? 0 : this.percentage;
    const progress = Math.floor(duration * percentage / 100);
    const progressMs = moment(progress).format('m:ss');
    const durationMs = moment(duration).format('m:ss');
    this.progressMs = progressMs;
    this.durationMs = durationMs;
  }

}
