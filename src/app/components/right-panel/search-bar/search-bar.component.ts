import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorsEnum } from '../../../enums/colors.enum';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { SearchResponse } from '../../../models/search-response.interface';
import { HoverableComponent } from '../../hoverable/hoverable.component';

@Component({
  selector : 'app-search-bar',
  templateUrl : './search-bar.component.html',
  styleUrls : [ './search-bar.component.scss' ]
})
export class SearchBarComponent extends HoverableComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('content') content: ElementRef;

  showSearchResult = false;
  loading = false;
  spinnerColor = ColorsEnum.ORANGE;
  searchResultHeight = 0;
  searchResult: SearchResponse;
  searchValue: string;
  maskLeft: number;

  private _timer: any;

  constructor(private _spotifyService: SpotifyService) {super(); }

  ngOnInit(): void {
  }

  onFocus(): void {
    const shouldSearch = this.searchValue?.length > 0;
    if (shouldSearch) {
      this.search();
    }
  }

  onKeyPress(): void {
    clearTimeout(this._timer);
    this._timer = setTimeout(this.search.bind(this), 500);
  }

  onMaskClick(): void {
    this.searchResultHeight = 0;
    setTimeout(() => {
      this.showSearchResult = false;
      this.loading = false;
    }, 200);
  }

  onSearchClick(): void {
    this.searchValue = this.searchInput.nativeElement.value;
    const canSearch = this.searchValue.length > 0;
    if (canSearch) {
      this.search();
    }
  }

  onClearClick(): void {
    this.searchResultHeight = 0;
    this.searchInput.nativeElement.value = '';
    this.searchValue = '';
    setTimeout(() => {
      this.searchResult = {};
      this.showSearchResult = false;
    }, 200);
  }

  private setMaskLeft(): void {
    this.maskLeft = -this.content.nativeElement.offsetLeft;
  }

  private search(): void {
    this.searchValue = this.searchInput.nativeElement.value;
    this.showSearchResult = true;
    this.setMaskLeft();
    this.loading = true;
    const timer = setTimeout(() => this.searchResultHeight = 150, 0);
    this.searchValue = this.searchInput.nativeElement.value;
    this._spotifyService.search(this.searchValue).subscribe((response: SearchResponse) => {
      this.searchResult = response;
      clearTimeout(timer);
      setTimeout(() => this.searchResultHeight = 600, 0);
      this.loading = false;
    });
  }

}
