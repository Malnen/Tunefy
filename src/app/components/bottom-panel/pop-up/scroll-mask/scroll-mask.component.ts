import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasePopUpContentComponent} from '../base-pop-up-content/base-pop-up-content.component';
import {ColorsEnum} from '../../../../enums/colors.enum';
import {Player} from '../../../../models/player.interface';
import {SpotifyService} from '../../../../services/spotify/spotify.service';
import {LyricsProviderService} from '../../../../services/lyrics-provider/lyrics-provider.service';
import {Item} from '../../../../models/item.interface';
import {TinyColor} from '@ctrl/tinycolor';
import {LyricsResponse} from '../../../../models/lyricsResponse.interface';

@Component({
  selector: 'app-scroll-mask',
  templateUrl: './scroll-mask.component.html',
  styleUrls: ['./scroll-mask.component.scss']
})
export class ScrollMaskComponent extends BasePopUpContentComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  maskImage: string;
  hasError = false;

  private _topBlurOpacity = 0;
  private _bottomBlurOpacity = 1;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  onScroll(event?: Event): void {
    const target = event?.target as HTMLElement;
    this.calculateBlur(target);
    this.setMask();
  }

  setMask(): void {
    const color = ColorsEnum.POP_UP_BACKGROUND;
    const tinyColor = new TinyColor(color);
    const r = tinyColor.r;
    const g = tinyColor.g;
    const b = tinyColor.b;
    this.maskImage = `linear-gradient(to top,
    rgba(${r}, ${g}, ${b}, ${1 - this._bottomBlurOpacity}) 0%,
    rgba(255, 255, 255, 1) 15%,
    rgba(255, 255, 255, 1) 85%,
    rgba(${r}, ${g}, ${b}, ${1 - this._topBlurOpacity}) 100%)`;
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

}
