import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlaylistData } from '../../../models/playlist-data.interface';

@Component({
  selector: 'app-edit-playlist-dialog',
  templateUrl: './edit-playlist-dialog.component.html',
  styleUrls: ['./edit-playlist-dialog.component.scss']
})
export class EditPlaylistDialogComponent implements OnInit {

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
