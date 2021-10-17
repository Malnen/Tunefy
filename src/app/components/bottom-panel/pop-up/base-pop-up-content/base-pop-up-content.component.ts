import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorsEnum } from '../../../../enums/colors.enum';
import { HoverableComponent } from '../../../hoverable/hoverable.component';

@Component({
  selector: 'app-base-pop-up-content',
  templateUrl: './base-pop-up-content.component.html',
  styleUrls: ['./base-pop-up-content.component.scss']
})
export abstract class BasePopUpContentComponent extends HoverableComponent implements OnInit {

  @Output() loaded: EventEmitter<void> = new EventEmitter<void>();

  loading = true;
  spinnerColor = ColorsEnum.ORANGE;

  protected constructor() {super(); }

  ngOnInit(): void {
  }

  protected emitLoadedEvent(): void {
    this.loaded.emit();
  }

}
