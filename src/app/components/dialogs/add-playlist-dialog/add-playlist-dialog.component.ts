import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlaylistData } from '../../../models/playlist-data.interface';

@Component({
  selector : 'app-playlist-dialog',
  templateUrl : './add-playlist-dialog.component.html',
  styleUrls : [ './add-playlist-dialog.component.scss' ]
})
export class AddPlaylistDialogComponent implements OnInit {

  @ViewChild('name') name: ElementRef;
  @ViewChild('description') description: ElementRef;

  data: PlaylistData;

  constructor() { }

  ngOnInit(): void {
  }

  onNameChange(): void {
    this.setData();
  }

  onDescriptionChange(): void {
    this.setData();
  }

  setData(): void {
    this.data = {
      name : this.name.nativeElement.value,
      description : this.description.nativeElement.value
    };
  }

}
