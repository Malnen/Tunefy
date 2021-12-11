import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaylistDialogComponent } from '../../components/dialogs/add-playlist-dialog/add-playlist-dialog.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SpotifyService } from '../spotify/spotify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { Playlist } from '../../models/playlist.interface';
import { DeletePlaylistDialogComponent } from '../../components/dialogs/delete-playlist-dialog/delete-playlist-dialog.component';
import { AddLocalSourceDialogComponent } from '../../components/dialogs/add-local-source-dialog/add-local-source-dialog.component';
import { SnackBarService } from '../snack-bar-service/snack-bar.service';
import { PlaylistData } from '../../models/playlist-data.interface';
import { EditPlaylistDialogComponent } from '../../components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { ChangePlaylistImageDialogComponent } from '../../components/dialogs/change-playlist-image-dialog/change-playlist-image-dialog.component';
import { PlaylistCoverData } from '../../models/playlist-cover-data.interface';

@Injectable({
  providedIn : 'root'
})
export class DialogService {

  private _playlistsUpdated = new Subject<void>();

  constructor(private _dialog: MatDialog,
              private _spotifyService: SpotifyService,
              private _snackBarService: SnackBarService) { }

  hasPlaylistsUpdated(): Observable<void> {
    return this._playlistsUpdated.asObservable();
  }

  openAddPlaylistDialog(): void {
    const dialogRef = this._dialog.open(AddPlaylistDialogComponent, {
      panelClass : 'add-playlist-dialog',
      scrollStrategy : new NoopScrollStrategy()
    });
    dialogRef.afterClosed().subscribe((action: PlaylistData) => {
      if (action) {
        this.createPlaylist(action);
      }
    });
  }

  openAddLocalSourceDialog(callback: () => {}): void {
    const dialogRef = this._dialog.open(AddLocalSourceDialogComponent, {
      panelClass : 'add-local-source-dialog',
      scrollStrategy : new NoopScrollStrategy()
    });
    dialogRef.afterClosed().subscribe((action: HTMLInputElement) => {
      if (action) {
        callback();
      }
    });
  }

  openChangePlaylistImageDialog(playlist: Playlist): void {
    const dialogRef = this._dialog.open(ChangePlaylistImageDialogComponent, {
      panelClass : 'change-playlist-image-dialog',
      scrollStrategy : new NoopScrollStrategy()
    });
    dialogRef.componentInstance.playlist = playlist;
    dialogRef.afterClosed().subscribe((data: PlaylistCoverData) => {
      if (data) {
        this.changePlaylistImage(data);
      }
    });
  }

  openDeletePlaylistDialog(playlist: Playlist): void {
    const dialogRef = this._dialog.open(DeletePlaylistDialogComponent, {
      panelClass : 'delete-playlist-dialog',
      scrollStrategy : new NoopScrollStrategy()
    });
    dialogRef.afterClosed().subscribe((action: boolean) => {
      if (action) {
        this.deletePlaylist(playlist.id);
      }
    });
  }

  openEditPlaylistDialog(playlist: Playlist): void {
    const dialogRef = this._dialog.open(EditPlaylistDialogComponent, {
      panelClass : 'edit-playlist-dialog',
      scrollStrategy : new NoopScrollStrategy()
    });
    dialogRef.componentInstance.data = {
      name : playlist.name,
      description : playlist.description
    };
    dialogRef.afterClosed().subscribe((action: PlaylistData) => {
      if (action) {
        this.editPlaylist(action, playlist);
      }
    });
  }

  private createPlaylist(data: PlaylistData): void {
    this._spotifyService.creatPlaylist(data)
      .subscribe(
        () => {
          this._snackBarService.showSnackBar('Playlista została utworzona');
          this._playlistsUpdated.next();
        },
        () => this._snackBarService.showSnackBar('Nie utworzono playlisty'));
  }

  private editPlaylist(data: PlaylistData, playlist: Playlist): void {
    this._spotifyService.editPlaylist(data, playlist)
      .subscribe(
        () => {
          this._snackBarService.showSnackBar('Playlista została zmodyfikowana');
          this._playlistsUpdated.next();
          playlist.name = data.name;
          playlist.description = data.description;
        },
        () => this._snackBarService.showSnackBar('Nie udało się zmodyfikować playlisty'));
  }

  private changePlaylistImage(data: PlaylistCoverData): void {
    const reader = new FileReader();
    reader.readAsDataURL(data.image);
    reader.onload = () => {
      this._spotifyService.changePlaylistImage(data, reader.result)
        .subscribe(
          () => {
            this._snackBarService.showSnackBar('Okładka została zmodyfikowana');
            this._playlistsUpdated.next();
          },
          () => this._snackBarService.showSnackBar('Nie udało się zmienić okładki playlisty'));
    };
  }

  private deletePlaylist(id: string): void {
    this._spotifyService.deletePlaylist(id)
      .subscribe(
        () => {
          this._snackBarService.showSnackBar('Playlista została usunięta');
          this._playlistsUpdated.next();
        });
  }

}
