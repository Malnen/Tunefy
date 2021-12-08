import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn : 'root'
})
export class SnackBarService {

  constructor(
    private _snackBar: MatSnackBar) { }

  showSnackBar(message: string): void {
    this._snackBar.open(message, '', { duration : 2000 });
  }
}
