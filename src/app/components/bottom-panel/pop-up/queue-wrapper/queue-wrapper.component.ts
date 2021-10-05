import { Component, OnInit } from '@angular/core';
import { BasePopUpContentComponent } from '../base-pop-up-content/base-pop-up-content.component';

@Component({
  selector: 'app-queue-wrapper',
  templateUrl: './queue-wrapper.component.html',
  styleUrls: ['./queue-wrapper.component.scss']
})
export class QueueWrapperComponent extends BasePopUpContentComponent implements OnInit {

  constructor() {super(); }

  ngOnInit(): void {
  }

}
