import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hoverable',
  templateUrl: './hoverable.component.html',
  styleUrls: ['./hoverable.component.scss']
})
export abstract class HoverableComponent implements OnInit {

  hover: boolean;

  protected constructor() { }

  ngOnInit(): void {
  }

  onHover(event: boolean): void {
    this.hover = event;
  }

}
