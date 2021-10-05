import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorsEnum } from '../../../../enums/colors.enum';

@Component({
  selector: 'app-base-pop-up-content',
  templateUrl: './base-pop-up-content.component.html',
  styleUrls: ['./base-pop-up-content.component.scss']
})
export abstract class BasePopUpContentComponent implements OnInit {

  @Output() loaded: EventEmitter<void> = new EventEmitter<void>();

  hover: boolean;
  loading = true;
  spinnerColor = ColorsEnum.ORANGE;

  protected constructor() { }

  ngOnInit(): void {
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

  protected emitLoadedEvent(): void {
    this.loaded.emit();
  }

}
