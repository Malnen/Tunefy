import { Component, OnInit } from '@angular/core';
import {ScrollMaskComponent} from '../scroll-mask/scroll-mask.component';
import {Player} from '../../../../models/player.interface';
import {LyricsProviderService} from '../../../../services/lyrics-provider/lyrics-provider.service';
import {SpotifyService} from '../../../../services/spotify/spotify.service';
import {LyricsResponse} from '../../../../models/lyricsResponse.interface';
import {ColorsEnum} from '../../../../enums/colors.enum';
import {Item} from '../../../../models/item.interface';

@Component({
  selector: 'app-lyrics-wrapper',
  templateUrl: './lyrics-wrapper.component.html',
  styleUrls: ['./lyrics-wrapper.component.scss']
})
export class LyricsWrapperComponent extends ScrollMaskComponent implements OnInit {

  player: Player;
  currentItem: Item;
  lyrics: string;

  constructor(private _spotifyService: SpotifyService,
              private _lyricsProvider: LyricsProviderService) {
    super();
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      const item = player?.item;
      if (JSON.stringify(item) !== JSON.stringify(this.currentItem)) {
        this.loading = true;
        this.currentItem = player.item;
        this.getLyrics();
        this.setMask();
        this.emitLoadedEvent();
      }
    });
  }

  private getLyrics(): void {
    this._lyricsProvider.getLyrics(this.currentItem).subscribe((data: LyricsResponse) => {
      this.loading = true;
      this.hasError = false;
      const lyrics = data.lyrics;
      this.lyrics = this.convertLyricsToHTML(lyrics);
      this.emitLoadedEvent();
      this.loading = false;
      this.onScroll();
    }, (() => {
      this.lyrics = '';
      this.hasError = true;
      this.loading = false;
      this.emitLoadedEvent();
    }));
  }

  private convertLyricsToHTML(lyrics: string): string {
    let convertedLyrics = lyrics;
    convertedLyrics = convertedLyrics.replace(new RegExp(/\r\n/g), '<br><br>');
    convertedLyrics = convertedLyrics.replace(new RegExp(/[\r\n]/g), '<br>');
    convertedLyrics = convertedLyrics.replace(new RegExp(/<br><br>[<br>]+/g), '<br><br><br>');
    if (convertedLyrics.startsWith('Paroles de la chanson')) {
      const index = convertedLyrics.indexOf('<br><br>') + 8;
      convertedLyrics = convertedLyrics.substring(index);
    }

    let style = `"color: ${ ColorsEnum.LIGHT_ORANGE };`;
    style += `font-size: 1.2rem"`;
    convertedLyrics = convertedLyrics.replace(new RegExp(/\[/g), '<br><span style=' + style + '>');
    convertedLyrics = convertedLyrics.replace(new RegExp(/]/g), '</span><br>');

    return convertedLyrics;
  }

}
