import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Artist } from '../../../models/artist.interface';
import { Image } from '../../../models/image.interface';
import { Artists } from '../../../models/artists.interface';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { ArtistTopTracks } from '../../../models/artist-top-tracks.interface';
import { ArtistsAlbumsResponse } from '../../../models/artists-albums-response.interface';
import { ColorsEnum } from '../../../enums/colors.enum';

@Component({
  selector : 'app-artist-panel',
  templateUrl : './artist-panel.component.html',
  styleUrls : [ './artist-panel.component.scss' ]
})
export class ArtistPanelComponent implements OnInit, OnChanges {

  @Input() artist: Artist;
  @Input() container: HTMLElement;

  hasImage = true;
  image: Image;
  relatedArtists: Artists;
  albums: ArtistsAlbumsResponse;
  topTracks: ArtistTopTracks;
  loading: boolean;
  loadingAlbums: boolean;
  spinnerColor = ColorsEnum.ORANGE;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadImage();
    this.loadRelatedArtists();
    this.loadTopTracks();
    this.loadAlbums();
  }

  ngOnChanges(): void {
    this.loading = true;
    this.relatedArtists = null;
    this.loadImage();
    this.loadRelatedArtists();
    this.loadTopTracks();
    this.loadAlbums();
    this.scrollToTop();
  }

  onImageError(): void {
    this.hasImage = false;
  }

  protected loadImage(): void {
    if (this.artist?.images.length > 0) {
      this.hasImage = true;
      this.image = this.artist.images[ 0 ];
    } else {
      this.hasImage = false;
    }
  }

  private loadRelatedArtists(): void {
    this._spotifyService.getRelatedArtists(this.artist.id).subscribe((artists: Artists) => {
      this.relatedArtists = artists;
    });
  }

  private loadTopTracks(): void {
    this._spotifyService.getArtistTopTracks(this.artist.id).subscribe((tracks: ArtistTopTracks) => {
      this.topTracks = tracks;
      this.loading = false;
    });
  }

  private loadAlbums(): void {
    this._spotifyService.getArtistAlbums(this.artist.id).subscribe((albums: ArtistsAlbumsResponse) => {
      this.albums = albums;
      this.loadNextAlbums();
    });
  }

  private loadNextAlbums(): void {
    if (this.albums.next != null) {
      this.loadingAlbums = true;
      this._spotifyService.getArtistAlbums(this.artist.id, this.albums.next).subscribe((albums: ArtistsAlbumsResponse) => {
        this.albums.items.push(...albums.items);
        this.albums.next = albums.next;
        this.loadNextAlbums();
      });
    } else {
      this.filterAlbums();
    }
  }

  private filterAlbums(): void {
    const albums = new Map();
    for (const album of this.albums.items) {
      const key = album.name + album.release_date;
      if (!albums.has(key)) {
        albums.set(key, album);
      }
    }

    this.albums.items = Array.from(albums.values());
    this.loadingAlbums = false;
  }

  private scrollToTop(): void {
    if (this.container) {
      this.container.scrollTo({
        top : 0,
        left : 0,
        behavior : 'smooth'
      });
    }
  }

}
