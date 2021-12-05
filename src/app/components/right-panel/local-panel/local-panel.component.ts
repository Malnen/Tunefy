import { Component, Input, OnInit } from '@angular/core';
// @ts-ignore
import fs from 'fs';
import { DialogService } from '../../../services/dialog/dialog.service';

@Component({
  selector : 'app-local-panel',
  templateUrl : './local-panel.component.html',
  styleUrls : [ './local-panel.component.scss' ]
})
export class LocalPanelComponent implements OnInit {

  @Input() container: HTMLElement;

  urls: string[];

  constructor(private _dialogService: DialogService) { }

  ngOnInit(): void {
    this.loadUrls();
    this.load();
  }

  click(): void {
    this._dialogService.openAddLocalSourceDialog(this.addSource.bind(this));
  }

  private addSource(): void {
    this.saveUrls();
  }

  private loadUrls(): void {
    this.urls = JSON.parse(localStorage.getItem('localUrls'));
  }

  private saveUrls(): void {
    localStorage.setItem('localUrls', JSON.stringify(this.urls));
  }

  private load(): void {
    try {
      const dir = fs.opendirSync('C:\\Users\\malne\\Music');
      console.log(dir);
    } catch (err) {
      console.error(err);
    }

  }

}
