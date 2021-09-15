import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { TrackAnalysis } from '../../../../models/track-analysis.interface';
import { Segment } from '../../../../models/segment.interface';
import { Player } from '../../../../models/player.interface';

@Component({
  selector : 'app-progress-bar',
  templateUrl : './progress-bar.component.html',
  styleUrls : [ './progress-bar.component.scss' ]
})
export class ProgressBarComponent implements OnChanges {

  @Input() player: Player;

  progress = 0;

  constructor() {
  }

  ngOnChanges(): void {
    this.setProgress();
  }

  private setProgress(): void {
    if (this.player == null) {
      this.progress = 0;
    } else {
      const duration = this.player.item?.duration_ms;
      const progress = this.player.progress_ms;
      this.progress = progress / duration * 100;
    }
  }

}
