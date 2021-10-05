import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorsEnum } from '../../../enums/colors.enum';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { SearchResponse } from '../../../models/search-response.interface';

@Component({
  selector : 'app-search-bar',
  templateUrl : './search-bar.component.html',
  styleUrls : [ './search-bar.component.scss' ]
})
export class SearchBarComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  hover: boolean;
  showSearchResult = false;
  loading = false;
  spinnerColor = ColorsEnum.ORANGE;
  searchResultHeight = 0;
  searchResult: SearchResponse;
  searchValue: string;

  private _timer: number;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

  onFocus(): void {
    const shouldSearch = this.searchValue?.length > 0;
    if (shouldSearch) {
      this.search();
    }
  }

  onKeyPress(): void {
    clearTimeout(this._timer);
    this.searchValue = this.searchInput.nativeElement.value;
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
    }, 200);
  }

  private search(): void {
    this.showSearchResult = true;
    this.loading = true;
    const timer = setTimeout(() => this.searchResultHeight = 150, 0);
    this.searchValue = this.searchInput.nativeElement.value;
    this._spotifyService.search(this.searchValue).subscribe((response: SearchResponse) => {
      console.log(response);
      this.searchResult = response;
      clearTimeout(timer);
      setTimeout(() => this.searchResultHeight = 600, 0);
      this.loading = false;
    });
  }

}
