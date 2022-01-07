import { Component, OnInit } from '@angular/core';
import { Item } from '../../../models/item.interface';

@Component({
  selector : 'app-lyrics-dialog',
  templateUrl : './lyrics-dialog.component.html',
  styleUrls : [ './lyrics-dialog.component.scss' ]
})
export class LyricsDialogComponent implements OnInit {

  track: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
