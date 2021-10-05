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
  backgroundImage: string;
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
        this.setBackgroundImage();
        this.emitLoadedEvent();
      }
    });
  }

  onScroll(event?: Event): void {
    const target = event?.target as HTMLElement;
    this._topBlurOpacity = this.calculateTopBlur(target);
    this._bottomBlurOpacity = this.calculateBottomBlur(target);
    this.setBackgroundImage();
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

  private calculateTopBlur(target: HTMLElement | undefined): number {
    const scrollTop = target ? target.scrollTop : 0;
    const blurTop = scrollTop / 100;
    if (blurTop > 1) {
      return 1;
    } else if (blurTop < 0) {
      return 0;
    }

    return blurTop;
  }

  private calculateBottomBlur(target: HTMLElement | undefined): number {
    const scrollTop = target ? target.scrollHeight - target.scrollTop - target.clientHeight : 0;
    const blurTop = scrollTop / 50;
    if (blurTop > 1) {
      return 1;
    } else if (blurTop < 0) {
      return 0;
    }

    return blurTop;
  }

  private setBackgroundImage(): void {
    const color = ColorsEnum.POP_UP_BACKGROUND;
    const tinyColor = new TinyColor(color);
    const r = tinyColor.r;
    const g = tinyColor.g;
    const b = tinyColor.b;
    this.backgroundImage = `linear-gradient(to top,
    rgba(${ r }, ${ g }, ${ b }, ${ this._bottomBlurOpacity }) 0%,
    rgba(255, 255, 255, 0) 15%,
    rgba(255, 255, 255, 0) 85%,
    rgba(${ r }, ${ g }, ${ b }, ${ this._topBlurOpacity })`;
  }

}
