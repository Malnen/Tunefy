import { Component, Input, OnInit } from '@angular/core';
import { ContentType } from '../../../enums/content-type.enum';
import { Switch } from '../../../models/switch.interface';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { RecentlyPlayed } from '../../../models/recently-played.interface';
import { ColorsEnum } from '../../../enums/colors.enum';
import { DateRange } from '../../../models/date-range.interface';

@Component({
  selector : 'app-stats-panel',
  templateUrl : './stats-panel.component.html',
  styleUrls : [ './stats-panel.component.scss' ]
})
export class StatsPanelComponent implements OnInit {

  @Input() container: HTMLElement;

  contentType = ContentType.artist;
  switches: Switch[];
  recentlyPlayed: RecentlyPlayed;
  loading = true;
  spinnerColor = ColorsEnum.ORANGE;

  private _firstCall = true;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.initSwitches();
    this.loading = true;
    this.updateRecentlyPlayed();
  }

  switch(switcher: Switch): void {
    this.contentType = switcher.contentType;
  }

  refresh(range: DateRange): void {
    this.updateRecentlyPlayed(range);
  }

  private updateRecentlyPlayed(range?: DateRange): void {
    this._spotifyService.getRecentlyPlayed(range).subscribe((recentlyPlayed: RecentlyPlayed) => {
      if (this._firstCall) {
        this._spotifyService.hasRecentlyPlayedUpdate().subscribe((updatedRecentlyPlayed: RecentlyPlayed) => {
          this.recentlyPlayed = updatedRecentlyPlayed;
          this.loading = false;
          this._firstCall = false;
        });
      }

      this._spotifyService.updateRecentlyPlayed(this.filterRecentlyPlayed(recentlyPlayed));
      this.loading = false;
    });
  }

  private filterRecentlyPlayed(recentlyPlayed: RecentlyPlayed): RecentlyPlayed {
    const items = recentlyPlayed.items;
    const resultMap = new Map();
    for (const item of items) {
      resultMap.set(item.track.id, item);
    }
    return { items : Array.from(resultMap.values()) } as RecentlyPlayed;
  }

  private initSwitches(): void {
    this.switches = [
      {
        name : 'Artyści',
        icon : '',
        contentType : ContentType.artist
      },
      {
        name : 'Albumy',
        icon : '',
        contentType : ContentType.album
      },
      {
        name : 'Gatunki',
        icon : '',
        contentType : ContentType.genres
      }
    ];
  }

}
