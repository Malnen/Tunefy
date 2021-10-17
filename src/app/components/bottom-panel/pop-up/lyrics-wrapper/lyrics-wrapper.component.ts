import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasePopUpContentComponent } from '../base-pop-up-content/base-pop-up-content.component';
import { ColorsEnum } from '../../../../enums/colors.enum';
import { Player } from '../../../../models/player.interface';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { LyricsProviderService } from '../../../../services/lyrics-provider/lyrics-provider.service';
import { Item } from '../../../../models/item.interface';
import { TinyColor } from '@ctrl/tinycolor';
import { LyricsResponse } from '../../../../models/lyricsResponse.interface';

@Component({
  selector : 'app-lyrics-wrapper',
  templateUrl : './lyrics-wrapper.component.html',
  styleUrls : [ './lyrics-wrapper.component.scss' ]
})
export class LyricsWrapperComponent extends BasePopUpContentComponent implements OnInit {

  @ViewChild('lyricsContainer') lyricsContainer: ElementRef;

  player: Player;
  currentItem: Item;
  lyrics: string;
  maskImage: string;
  hasError = false;

  private _topBlurOpacity = 0;
  private _bottomBlurOpacity = 1;

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

  onScroll(event?: Event): void {
    const target = event?.target as HTMLElement;
    this.calculateBlur(target);
    this.setMask();
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

  private calculateBlur(target: HTMLElement | undefined): void {
    const scrollPosition = target ? target.scrollTop / (target.scrollHeight - target.clientHeight) : 0;

    let blurTop: number;
    let blurBottom: number;

    if (scrollPosition < 0.1) {
      blurTop = scrollPosition * 10;
      blurBottom = 1;
    } else if (scrollPosition > 0.1 && scrollPosition < 0.9) {
      blurTop = 1;
      blurBottom = 1;
    } else {
      blurTop = 1;
      blurBottom = (1 - scrollPosition) * 10;
    }

    this._topBlurOpacity = blurTop;
    this._bottomBlurOpacity = blurBottom;
  }

  private setMask(): void {
    const color = ColorsEnum.POP_UP_BACKGROUND;
    const tinyColor = new TinyColor(color);
    const r = tinyColor.r;
    const g = tinyColor.g;
    const b = tinyColor.b;
    this.maskImage = `linear-gradient(to top,
    rgba(${ r }, ${ g }, ${ b }, ${ 1 - this._bottomBlurOpacity }) 0%,
    rgba(255, 255, 255, 1) 15%,
    rgba(255, 255, 255, 1) 85%,
    rgba(${ r }, ${ g }, ${ b }, ${ 1 - this._topBlurOpacity }) 100%)`;
  }

}
