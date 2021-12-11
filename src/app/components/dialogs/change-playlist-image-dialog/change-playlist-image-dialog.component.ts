import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { PlaylistCoverData } from '../../../models/playlist-cover-data.interface';
import { Playlist } from '../../../models/playlist.interface';

@Component({
  selector : 'app-change-playlist-image-dialog',
  templateUrl : './change-playlist-image-dialog.component.html',
  styleUrls : [ './change-playlist-image-dialog.component.scss' ]
})
export class ChangePlaylistImageDialogComponent implements OnInit {

  fileName = '';
  file: File;
  data: PlaylistCoverData;
  playlist: Playlist;

  constructor(private _spotifyService: SpotifyService) {}

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    this.file = event.target.files[ 0 ];

    if (this.file) {
      this.fileName = this.file.name;
      const formData = new FormData();
      formData.append('thumbnail', this.file);
      this.data = {
        image : this.file,
        playlist : this.playlist
      };
    }

  }

}
