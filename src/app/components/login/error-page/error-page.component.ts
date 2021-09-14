import {Component, OnInit} from '@angular/core';
import {ColorsEnum} from '../../../enums/colors.enum';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  spinnerColor = ColorsEnum.ORANGE;
  counter = 5;

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
    setInterval(this.redirectTimer.bind(this), 1000);
  }

  private redirectTimer(): void {
    if (this.counter <= 0) {
      this._router.navigate(['./']);
    }

    this.counter -= 1;
  }

}
