import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../../models/item.interface';
import { SpotifyService } from '../spotify/spotify.service';
import { RecentlyPlayed } from '../../models/recently-played.interface';
import { GenresResponse } from '../../models/genres-response.interface';
import { Artists } from '../../models/artists.interface';
import { RecommendationResponse } from '../../models/recommendations-response.interface';
import { Image } from '../../models/image.interface';

@Injectable({
  providedIn : 'root'
})
export class DiscoverService {

  private _genres = new BehaviorSubject<string[]>([]);
  private _currentTrack = new BehaviorSubject<Item>(null);
  private _previousTrack = new BehaviorSubject<Item>(null);
  private _nextTrack = new BehaviorSubject<Item>(null);
  private _currentImage = new BehaviorSubject<Image>(null);
  private _nextImage = new BehaviorSubject<Image>(null);
  private _previousImage = new BehaviorSubject<Image>(null);
  private _tracks = new BehaviorSubject<Item[]>([]);
  private _loading = new BehaviorSubject<boolean>(false);
  private _currentIndex = 0;
  private _availableGenres: string[];

  constructor(private _spotifyService: SpotifyService) { }

  updateTracks(tracks: Item[]): void {
    this._tracks.next(tracks);
  }

  hasTracksUpdated(): Observable<Item[]> {
    return this._tracks.asObservable();
  }

  hasCurrentTrackUpdated(): Observable<Item> {
    return this._currentTrack.asObservable();
  }

  hasPreviousTrackUpdated(): Observable<Item> {
    return this._previousTrack.asObservable();
  }

  hasNextTrackUpdated(): Observable<Item> {
    return this._nextTrack.asObservable();
  }

  hasCurrentTrackImageUpdated(): Observable<Image> {
    return this._currentImage.asObservable();
  }

  hasPreviousTrackImageUpdated(): Observable<Image> {
    return this._previousImage.asObservable();
  }

  hasNextTrackImageUpdated(): Observable<Image> {
    return this._nextImage.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  load(): void {
    if (this._tracks.value.length > 0) {
      return;
    }

    this._loading.next(true);
    this._spotifyService.getAvailableGenres().subscribe((genres: GenresResponse) => {
      this._availableGenres = genres.genres.map(value => value.replace(/-/g, ' '));
      this._spotifyService.getRecentlyPlayed().subscribe((recentlyPlayed: RecentlyPlayed) => {
        if (recentlyPlayed.items.length < 1) {
          while (this._genres.value.length < 2) {
            const random = Math.floor(Math.random() * (this._availableGenres.length));
            const genre = this._availableGenres[ random ];
            if (!this._genres.value.includes(genre)) {
              this._genres.value.push(genre);
            }
          }
          this.setTracks();
        } else {
          this._tracks.next(recentlyPlayed.items.map(value => value.track));
          this.setGenres();
        }
      });
    });
  }

  nextTrack(): void {
    const size = this._tracks.value.length;

    if (this._currentIndex < size) {
      this._currentIndex++;
    }

    const diff = size - this._currentIndex;
    if (diff < 20) {
      this.loadNext();
    }

    this.updateDisplayedTracks();
  }

  previousTrack(): void {
    if (this._currentIndex > 0) {
      this._currentIndex--;
    }

    this.updateDisplayedTracks();
  }

  private loadNext(): void {
    const artistIds = this.getArtistIds();
    this._spotifyService.getRecommendedTrack(this._genres.value, artistIds).subscribe((response: RecommendationResponse) => {
      for (const track of response.tracks) {
        if (!this._tracks.value.includes(track)) {
          this._tracks.value.push(track);
        }
      }
    });
  }

  private setGenres(): void {
    let ids = [];
    for (const item of this._tracks.value) {
      for (const artist of item.artists) {
        if (!ids.includes(artist.id)) {
          ids.push(artist.id);
        }
      }
    }

    ids = ids.slice(0, 50);
    this._spotifyService.getArtists(ids).subscribe((artists: Artists) => {
      const genresMap = new Map<string, number>();
      for (const artist of artists.artists) {
        if (artist.genres != null) {
          for (const genre of artist.genres) {
            if (genresMap.has(genre)) {
              const value = genresMap.get(genre) + 1;
              genresMap.set(genre, value);
            } else {
              genresMap.set(genre, 1);
            }
          }
        }
      }

      const genres = Array.from(genresMap.keys());
      for (const genre of genres) {
        if (!this._genres.value.includes(genre) && this._availableGenres.includes(genre)) {
          this._genres.value.push(genre);
        }
        if (this._genres.value.length > 1) {
          break;
        }
      }

      this.setTracks();
    });
  }

  private setTracks(): void {
    this._spotifyService.getRecommendedTrack(this._genres.value).subscribe((response: RecommendationResponse) => {
      this.filterTracks(response);
    });
  }

  private filterTracks(response: RecommendationResponse): void {
    this._spotifyService.checkIfTrackItemAreFollowed(response.tracks).subscribe((followedResponse: boolean[]) => {
      const tracks = [];
      for (let i = 0; i < response.tracks.length; i++) {
        if (!followedResponse[ i ]) {
          tracks.push(response.tracks[ i ]);
        }
      }

      this._tracks.next(tracks);
      this.setVariables();
    });
  }

  private setVariables(): void {
    this._currentTrack.next(this._tracks.value[ 0 ]);
    this._nextTrack.next(this._tracks.value[ 1 ]);
    this._previousTrack.next(null);
    this.setCurrentImage();
    this.setNextImage();
    this.setPreviousImage();
    this._loading.next(false);
  }

  private setCurrentImage(): void {
    this._currentImage.next(this._currentTrack.value.album.images[ 0 ]);
  }

  private setNextImage(): void {
    this._nextImage.next(this._nextTrack.value.album.images[ 0 ]);
  }

  private setPreviousImage(): void {
    if (this._currentIndex > 0) {
      this._previousImage.next(this._previousTrack?.value.album.images[ 0 ]);
    } else {
      this._previousImage.next(null);
    }
  }

  private updateDisplayedTracks(): void {
    this._currentTrack.next(this._tracks.value[ this._currentIndex ]);
    this._nextTrack.next(this._tracks.value[ this._currentIndex + 1 ]);
    if (this._currentIndex > 0) {
      this._previousTrack.next(this._tracks.value[ this._currentIndex - 1 ]);
    } else {
      this._previousTrack.next(null);
    }

    this.setCurrentImage();
    this.setNextImage();
    this.setPreviousImage();
  }

  private getArtistIds(): string[] {
    const ids = [];
    const size = this._tracks.value.length;
    for (let i = size - 1; i > 0; i--) {
      const track = this._tracks.value[ i ];
      for (const artist of track.artists) {
        const id = artist.id;
        if (!ids.includes(id)) {
          ids.push(id);
        }
        if (ids.length > 2) {
          return ids;
        }
      }
    }

    return ids;
  }

}
