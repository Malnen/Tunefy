import { Component, OnInit } from '@angular/core';
import { Item } from '../../../models/item.interface';

@Component({
  selector: 'app-audio-features-dialog',
  templateUrl: './audio-features-dialog.component.html',
  styleUrls: ['./audio-features-dialog.component.scss']
})
export class AudioFeaturesDialogComponent implements OnInit {

  track: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
