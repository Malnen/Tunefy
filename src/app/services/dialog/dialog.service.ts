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
    dialogRef.afterClosed().subscribe((action: HTMLInputElement) => {
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

  private createPlaylist(input: HTMLInputElement): void {
    this._spotifyService.creatPlaylist(input.value)
      .subscribe(
        () => {
          this._snackBarService.showSnackBar('Playlista została utworzona');
          this._playlistsUpdated.next();
        },
        () => this._snackBarService.showSnackBar('Nie utworzono playlisty'));
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
